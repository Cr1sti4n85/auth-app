import { Route, Routes } from "react-router";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Holanda que talca</h1>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
