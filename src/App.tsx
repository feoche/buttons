import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllButtons from "./components/AllButtons";
import "./styles/style.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AllButtons />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

