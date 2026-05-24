import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    // Basic validation

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username,
          email,
          password,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (err) {

      console.log("FULL ERROR:", err.response);

      console.log("DATA:", err.response?.data);

      console.log("MESSAGE:", err.message);

      alert(
        err.response?.data?.detail ||
        "Registration failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        {/* Username */}

        <input
          className="w-full p-3 border mb-4 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}

        <input
          className="w-full p-3 border mb-4 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}

        <input
          className="w-full p-3 border mb-4 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded"
        >
          Register
        </button>

        {/* Login Link */}

        <p className="mt-4 text-center">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}