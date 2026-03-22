
import { Navigate, Route, Routes } from "react-router-dom";

import { Timeline } from "./pages/Timeline";
import { AuthPage } from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/auth/:mode" element={<AuthPage />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/" element={<Timeline />} />
      <Route path="*" element={<Navigate to="/auth/login" />} />

    </Routes>

  );
}

export default App;
