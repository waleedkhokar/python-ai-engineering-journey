import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";

import {
  FaShieldAlt,
  FaEnvelope,
  FaLink,
  FaLock,
  FaCommentAlt,
  FaRobot,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />

      <Hero />

      <section
        id="features"
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-bold text-center">
          AI-Powered Cybersecurity Features
        </h2>

        <p className="text-center text-slate-400 mt-4 max-w-3xl mx-auto">
          CyberSafe AI helps you investigate cyber threats using artificial
          intelligence. Analyse emails, URLs, SMS messages, passwords, and learn
          cybersecurity through an AI tutor.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Email Investigation"
            description="Analyse suspicious emails for phishing, scams, and impersonation."
            icon={<FaEnvelope />}
            link="/email"
          />

          <FeatureCard
            title="URL Scanner"
            description="Detect phishing websites, fake domains, and malicious links."
            icon={<FaLink />}
            link="/url"
          />

          <FeatureCard
            title="SMS Scam Detector"
            description="Identify scam messages, OTP fraud, and social engineering attacks."
            icon={<FaCommentAlt />}
            link="/sms"
          />

          <FeatureCard
            title="Password Advisor"
            description="Evaluate password strength and receive security recommendations."
            icon={<FaLock />}
            link="/password"
          />

          <FeatureCard
            title="Cyber Tutor"
            description="Ask cybersecurity questions and learn from an AI-powered tutor."
            icon={<FaRobot />}
            link="/cyber-tutor"
          />

          <FeatureCard
            title="Threat Reports"
            description="Receive structured AI investigation reports with actionable recommendations."
            icon={<FaShieldAlt />}
            link="/threat-reports"
          />
        </div>
      </section>
    </div>
  );
}