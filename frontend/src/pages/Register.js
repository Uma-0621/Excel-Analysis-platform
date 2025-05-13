import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`;
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: fullName,
        email,
        password,
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <AuthLayout title="Register">
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          className="w-full px-4 py-2 border rounded-md bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full px-4 py-2 border rounded-md bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md bg-white/60 dark:bg-gray-700 dark:text-white border-indigo-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-indigo-700 dark:text-indigo-400 hover:underline"
        >
          Login
        </a>
      </p>
    </AuthLayout>
  );
};

export default Register;
