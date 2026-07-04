"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, UserCircle2 } from "lucide-react";

export function AuthPage({
  isSignin,
  handle,
  loading,
}: {
  isSignin: boolean;
  handle: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f6f1eb]">
      {/* Floating Warm Blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full
        bg-gradient-to-br from-orange-200/40 to-orange-300/40 blur-3xl"
        />

        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full
        bg-gradient-to-br from-orange-300/30 to-orange-200/30 blur-3xl opacity-40"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-16 h-16 rounded-2xl 
            bg-[#e07a5f] shadow-xl shadow-orange-300/30"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="mt-6 text-3xl font-bold text-[#1f2937]">
            {isSignin ? "Welcome Back" : "Create Your Account"}
          </h1>

          {isSignin ? (
            <p className="mt-2 text-sm text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[#e07a5f] font-medium hover:underline"
              >
                Create one
              </a>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#e07a5f] font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          )}
        </div>

        {/* Card */}
        <div
          className="bg-[#fbf7f2] backdrop-blur-xl border 
        border-[#eee6dc] shadow-2xl shadow-black/5 rounded-2xl px-8 py-10"
        >
          <form onSubmit={handle} className="space-y-6">
            {/* Email */}
            <InputField
              id="email"
              label="Email address"
              type="email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              placeholder="you@example.com"
            />

            {/* Password */}
            <InputField
              id="password"
              label="Password"
              type="password"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              placeholder="••••••••"
            />

            {/* Additional fields only for SignUp */}
            {!isSignin && (
              <>
                <InputField
                  id="firstName"
                  label="First Name"
                  type="text"
                  icon={<UserCircle2 className="h-5 w-5 text-gray-400" />}
                  placeholder="first name"
                />

                <InputField
                  id="lastName"
                  label="Last Name"
                  type="text"
                  icon={<UserCircle2 className="h-5 w-5 text-gray-400" />}
                  placeholder="last name"
                />
              </>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl
              bg-[#e07a5f] text-white font-medium shadow-lg shadow-orange-300/30 
              hover:bg-[#d96d51] transition-all"
            >
              {loading ? (
                <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------ */
/*               Input Component              */
/* ------------------------------------------ */

function InputField({
  id,
  label,
  type,
  placeholder,
  icon,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {icon}
        </span>

        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-3 py-2.5 text-[15px] rounded-xl outline-none
          bg-white border border-gray-300 text-gray-900
          focus:ring-2 focus:ring-[#e07a5f] focus:border-[#e07a5f]
          shadow-sm transition-all"
        />
      </div>
    </div>
  );
}
