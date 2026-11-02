import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CyberTutor from "./pages/CyberTutor";
import EmailInvestigator from "./pages/EmailInvestigator";

import URLInvestigator from "./pages/URLInvestigator";
import SMSInvestigator from "./pages/SMSInvestigator";
import PasswordAdvisor from "./pages/PasswordAdvisor";
import History from "./pages/History";
import ThreatReports from "./pages/ThreatReports";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      <Route
  path="/cyber-tutor"
  element={
    <ProtectedRoute>
      <CyberTutor />
    </ProtectedRoute>
  }
/>
     <Route
  path="/email"
  element={
    <ProtectedRoute>
      <EmailInvestigator />
    </ProtectedRoute>
  }
/>

<Route
  path="/url"
  element={
    <ProtectedRoute>
      <URLInvestigator />
    </ProtectedRoute>
  }
/>

<Route
  path="/sms"
  element={
    <ProtectedRoute>
      <SMSInvestigator />
    </ProtectedRoute>
  }
/>

<Route
  path="/password"
  element={
    <ProtectedRoute>
      <PasswordAdvisor />
    </ProtectedRoute>
  }
/>
<Route
  path="/threat-reports"
  element={
    <ProtectedRoute>
      <ThreatReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;
