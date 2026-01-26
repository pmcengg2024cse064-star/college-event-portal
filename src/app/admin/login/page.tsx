"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Check if user is admin
      if (data.user) {
        // Store auth token in localStorage
        if (data.session) {
          localStorage.setItem("admin_token", data.session.access_token);
          localStorage.setItem("admin_user", JSON.stringify(data.user));
        }
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl"></span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/60">
            Sign in to manage college events
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
              placeholder="admin@college.edu"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:outline-none transition-colors"
              placeholder=""
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-950 via-violet-900 to-slate-950 text-white/50">
                Demo Credentials
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white/70">
            <p className="mb-2 font-semibold text-white/90">For Testing:</p>
            <p>Email: admin@collegemail.com</p>
            <p>Password: Admin@12345</p>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
