import { Link } from "react-router-dom";

export default function FeatureCard({
  title,
  description,
  icon,
  link,
}) {
  return (
    <Link
      to={link}
      className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-cyan-400 hover:scale-105 transition duration-300"
    >
      <div className="text-5xl text-cyan-400 mb-4">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-slate-400">
        {description}
      </p>
    </Link>
  );
}