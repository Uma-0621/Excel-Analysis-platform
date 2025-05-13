import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-md border bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-md border bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:underline text-indigo-600 dark:text-indigo-400">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-indigo-700 dark:text-indigo-400 hover:underline"
        >
          Register here
        </a>
      </p>
    </AuthLayout>
  );
};

export default Login;
