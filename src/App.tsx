
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Timeline } from "./pages/Timeline";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/" element={<Timeline />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

  );
}

export default App;
