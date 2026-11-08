import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-cyan-400"
        >
          CyberSafe AI
        </Link>

        <div className="space-x-8 text-slate-300">

          <a href="#features" className="hover:text-cyan-400">
            Features
          </a>

          <a href="#about" className="hover:text-cyan-400">
            About
          </a>

          <Link
            to="/login"
            className="bg-cyan-500 px-5 py-2 rounded-lg text-white"
          >
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}