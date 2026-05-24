import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-6xl font-bold mb-4">
        Weather App ☀️
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Get real-time weather updates
      </p>

      <Link
        to="/register"
        className="bg-green-600 text-white px-6 py-3 rounded-xl mb-4"
      >
        Get Started
      </Link>

      <Link to="/login" className="text-blue-600 underline">
        Already have an account? Login
      </Link>

    </div>
  );
}