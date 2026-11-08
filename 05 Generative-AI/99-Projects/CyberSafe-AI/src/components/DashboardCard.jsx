import { Link } from "react-router-dom";

export default function DashboardCard({
    title,
    description,
    icon,
    link
}) {
    return (

        <Link
            to={link}
            className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-cyan-400 transition hover:scale-105"
        >

            <div className="text-5xl mb-4">

                {icon}

            </div>

            <h2 className="text-xl font-bold">

                {title}

            </h2>

            <p className="text-slate-400 mt-2">

                {description}

            </p>

        </Link>

    );
}