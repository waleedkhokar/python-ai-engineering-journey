import { useState } from "react";
import { supabase } from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registration successful! Please check your email.");

    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-slate-900 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded mb-4 text-amber-50 "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-4 text-amber-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded mb-6 text-amber-50 "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-cyan-600 py-3 rounded hover:bg-cyan-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link className="text-cyan-400" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}