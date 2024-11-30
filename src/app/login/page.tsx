"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const response = await fetch(
        "https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token); // Save access token to local storage
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          setSuccessMessage(null);
          router.push("/DashBoard"); // Redirect to a dashboard or homepage
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid login credentials.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </p>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700 transition duration-300"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          {/* Success message popup */}
          {successMessage && (
            <div className="mt-4 p-2 bg-green-200 text-green-800 rounded text-center">
              {successMessage}
            </div>
          )}

          <div className="text-center mt-6">
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup">
                <p className="font-medium text-lg text-green-700 hover:text-green-900">
                  Sign up
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
