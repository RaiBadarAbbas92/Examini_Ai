"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import token utilities
import { isTokenExpired } from "@/utils/isTokenExpired";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // useEffect(() => {
  //   const email = localStorage.getItem("email");
  //   const accessToken = localStorage.getItem("access_token");

  //   if (email && accessToken && !isTokenExpired(accessToken)) {
  //     router.push("/dashboard"); // Redirect to dashboard if already logged in
  //   }
  // }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, role }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.detail || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Signup page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-600 via-green-400 to-green-200 animate-gradient-xy"
      >
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transition-transform hover:scale-105">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-green-800">
              Create your account
            </h2>
            {error && (
              <p className="mt-2 text-sm text-red-600 animate-pulse">{error}</p>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-green-300 rounded-md placeholder-green-600 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Username"
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-green-300 rounded-md placeholder-green-600 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-green-300 rounded-md placeholder-green-600 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Password"
                />
              </div>
              <div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-4 py-2 border border-green-300 rounded-md bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white font-medium transition ${
                loading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-200 text-green-800 rounded text-center animate-fade-in">
              {successMessage}
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-green-600">
              Already have an account?{" "}
              <Link href="/login">
                <span className="font-medium text-green-800 hover:text-green-900 cursor-pointer">
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
