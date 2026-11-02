import DashboardCard from "../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import {
  FaEnvelope,
  FaLink,
  FaComment,
  FaLock,
  FaRobot,
  FaHistory,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <div>
            <h1 className="text-4xl font-bold">
              CyberSafe AI
            </h1>

            <p className="text-slate-400 mt-2">
              AI-Powered Cybersecurity Investigation Platform
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-8">
          Security Tools
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Email Investigation"
            description="Analyse suspicious emails for phishing and scams."
            icon={<FaEnvelope />}
            link="/email"
          />

          <DashboardCard
            title="URL Scanner"
            description="Investigate suspicious websites and URLs."
            icon={<FaLink />}
            link="/url"
          />

          <DashboardCard
            title="SMS Detector"
            description="Detect scam messages and social engineering attacks."
            icon={<FaComment />}
            link="/sms"
          />

          <DashboardCard
            title="Password Advisor"
            description="Evaluate password strength and receive recommendations."
            icon={<FaLock />}
            link="/password"
          />

          <DashboardCard
            title="Cyber Tutor"
            description="Learn cybersecurity through an AI tutor."
            icon={<FaRobot />}
            link="/cyber-tutor"
          />

          <DashboardCard
            title="Threat Reports"
            description="Browse common cyber threats and learn how to stay protected."
            icon={<FaShieldAlt />}
            link="/threat-reports"
          />

          <DashboardCard
            title="History"
            description="View your previous AI investigations."
            icon={<FaHistory />}
            link="/history"
          />
        </div>
      </div>
    </div>
  );
}