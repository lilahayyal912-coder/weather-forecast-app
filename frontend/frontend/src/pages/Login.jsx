import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    // Basic validation

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
  "user_id",
  res.data.user_id
);

localStorage.setItem(
  "username",
  res.data.username
);

alert(res.data.message);

navigate("/weather");

    } catch (err) {

      console.log("LOGIN ERROR:", err.response);

      alert(
        err.response?.data?.detail ||
        "Login failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* Username */}

        <input
          className="w-full p-3 border mb-4 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}

        <input
          className="w-full p-3 border mb-4 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
        >
          Login
        </button>

        {/* Register Link */}

        <p className="mt-4 text-center">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-green-600 underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}