import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllButtons from "./components/AllButtons";
import ButtonDetail from "./components/ButtonDetail";
import "./styles/style.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllButtons />} />
        <Route path="/:fileName" element={<ButtonDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

