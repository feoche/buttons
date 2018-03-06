(function($){
    var Observable = $.Observable = function(){
        this.observers = {};
    };
    Observable.prototype.on = function(event, callback){
        if (typeof callback !== 'function') return;
        (this.observers[event] = this.observers[event] || []).push(callback);
    };
    Observable.prototype.emit = function(event){
        var args = Array.prototype.slice.call(arguments, 1);
        (this.observers[event] || []).forEach(function(callback){
            callback.apply(undefined, args);
        });
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    var Button = $.Button = function(channel, note, midiAdapter){
        $.Observable.call(this);
        this.channel = channel;
        this.note = note;
        this.midiAdapter = midiAdapter;
        this.id = this.note;
        if (!this.isControl()) {
            this.x = this.note % 16;
            this.y = Math.floor(this.note / 16);
        } else {
            this.id -= 104;
        }
    };
    Button.prototype = Object.create($.Observable.prototype);
    Button.prototype.constructor = Button;
    Button.prototype.turn = function(color){
        this.paint($.defaults.paintNames[color]);
    };
    Button.prototype.paint = function(colors){
        colors = $.extend(colors, { 'red': 0, 'green': 0 });
        var velocity = (colors.green % 4) * 16 + (colors.red % 4);
        this.send(velocity);
    };
    Button.prototype.send = function(velocity){
        this.midiAdapter.send(this.channel, this.note, velocity);
    };
    Button.prototype.isControl = function(){
        return this.channel === 176;
    };
})(window.launchpad = window.launchpad || {});
;(function($, undefined){
    var defaults = $.defaults = {};

    function selectItem(name){
        return {
            'from': function(items){
                var item = items.next();
                while (!item.done) {
                    if (item.value.name === name) {
                        return item.value;
                    }
                    item = items.next();
                }
                return undefined;
            }
        };
    }

    defaults.paintNames = {
        'red':    { 'red': 3, 'green': 0 },
        'green':  { 'red': 0, 'green': 3 },
        'orange': { 'red': 3, 'green': 3 },
    };
    defaults.name = 'Launchpad Mini';
    defaults.sysex = false;
    defaults.midiAdapterFactory = function(accept, reject){
        if (!navigator.requestMIDIAccess){
            reject();
        } else {
            var padName = this.name;
            navigator.requestMIDIAccess({ sysex: this.sysex })
                .then(function(midiAccess){
                    return {
                        'input': selectItem(padName).from(midiAccess.inputs.values()),
                        'output': selectItem(padName).from(midiAccess.outputs.values())
                    };
                })
                .then(function(io){
                    return new $.MidiAdapter(io.input, io.output);
                })
                .then(function(midiAdapter){
                    return new $.Launchpad(midiAdapter);
                })
                .then(function(pad){
                    accept(pad);
                })
                .catch(reject);
        }
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    $.extend = function extend(){
        return Array.prototype.slice.call(arguments).reduce(function(result, dictionary){
            for (var key in dictionary){
                if (dictionary.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                    result[key] = dictionary[key];
                }
            }
            return result;
        }, {});
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    $.connect = function(options){
        options = $.extend(options || {}, $.defaults);
        return new Promise(options.midiAdapterFactory.bind(options));
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    var MidiAdapter = $.MidiAdapter = function(input, output){
        $.Observable.call(this);
        this.input = input;
        this.output = output;

        this.input.onmidimessage = this.onMidiMessageCallback.bind(this);
    };
    MidiAdapter.prototype = Object.create($.Observable.prototype);
    MidiAdapter.prototype.constructor = MidiAdapter;
    MidiAdapter.prototype.onMidiMessageCallback = function(message){
        var channel = message.data[0];
        var note = message.data[1];
        var velocity = message.data[2];
        this.emit('input', channel, note, velocity);
    };
    MidiAdapter.prototype.send = function(channel, note, velocity){
        this.output.send([channel, note, velocity]);
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    var inputHandlers = [
        {
            'applies': function(channel, note, velocity){ return velocity === 127; },
            'handle': function(pad, channel, note, velocity){
                pad.emit('press', new $.Button(channel, note, pad.midiAdapter));
            }
        },
        {
            'applies': function(channel, note, velocity){ return velocity === 0; },
            'handle': function(pad, channel, note, velocity){
                pad.emit('release', new $.Button(channel, note, pad.midiAdapter));
            }
        }
    ];

    var buttonLookups = [
        {
            'applies': function(args){ return args.length === 1; },
            'lookup': function(pad, args){
                return new $.Button(144, args[0], pad.midiAdapter);
            }
        },
        {
            'applies': function(args){ return args.length === 2; },
            'lookup': function(pad, args){
                return new $.Button(144, args[0] + 16 * args[1], pad.midiAdapter);
            }
        }
    ];

    var Pad = $.Launchpad = function(midiAdapter){
        $.Observable.call(this);
        this.midiAdapter = midiAdapter;
        this.midiAdapter.on('input', this.handleInput.bind(this));
    };
    Pad.prototype = Object.create($.Observable.prototype);
    Pad.prototype.constructor = Pad;
    Pad.prototype.handleInput = function(channel, note, velocity){
        inputHandlers
            .filter(function(handler){ return handler.applies(channel, note, velocity); })
            .forEach(function(handler){ handler.handle(this, channel, note, velocity); }.bind(this));
    };
    Pad.prototype.clear = function(){
        this.midiAdapter.send(176, 0, 0);
    };
    Pad.prototype.button = function(){
        var args = Array.prototype.slice.call(arguments);
        return buttonLookups
            .filter(function(buttonLookup){ return buttonLookup.applies(args); })
            .map(function(buttonLookup){ return buttonLookup.lookup(this, args); }.bind(this))
        [0];
    };
    Pad.prototype.controlButton = function(id){
        return new $.Button(176, 104 + id, this.midiAdapter);
    };
})(window.launchpad = window.launchpad || {});
;(function($){
    $.version = '1.0.0';
})(window.launchpad = window.launchpad || {});
