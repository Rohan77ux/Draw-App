"use client";
import { AuthPage } from "../../../components/AuthPage";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Sending data:", userData);

    try {
      const response = await axios.post(`${HTTP_BACKEND}/signin`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data?.token;

      if (token) {
        localStorage.setItem("Authorization", token);

        console.log("Token saved:", token);

        router.push("/room");
      } else {
        console.warn("No token or user data received!");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage
      isSignin={true}
      handle={handleSignup}
      loading={loading}
    ></AuthPage>
  );
}

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { Pencil, ArrowRight, Lock } from "lucide-react";
// import Link from "next/link";
// import axios from "axios";

// export default function SignInForm() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     username: "", // Usually the email field in your backend schema
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // Update this URL to your actual backend signin endpoint
//       const response = await axios.post(
//         "http://localhost:4000/signin",
//         formData
//       );
//       setMessage({ type: "success", text: "Logged in successfully!" });
//       if (response.data.token) {
//         // Redirect to dashboard or home page after successful login
//         router.push("/");
//       }
//       // Handle token storage (e.g., localStorage.setItem('token', response.data.token))
//     } catch (error: any) {
//       const errorMsg =
//         error.response?.data?.message ||
//         "Login failed. Please check your credentials.";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fffcf9] flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
//       {/* Brand Logo Link */}
//       <Link href="/" className="mb-8 flex items-center gap-2 group">
//         <div className="bg-[#f07c54] p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
//           <Pencil className="w-5 h-5 text-white" />
//         </div>
//         <span className="font-bold text-xl tracking-tight">Sketchboard</span>
//       </Link>

//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold tracking-tight mb-2">
//             Welcome back
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Pick up right where you left your ideas.
//           </p>
//         </div>

//         {/* Feedback Message */}
//         {message.text && (
//           <div
//             className={`mb-6 p-4 rounded-xl text-sm font-medium ${
//               message.type === "success"
//                 ? "bg-green-50 text-green-700 border border-green-100"
//                 : "bg-red-50 text-red-700 border border-red-100"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         <form className="space-y-5" onSubmit={handleSubmit}>
//           {/* Email / Username Field */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//               Email Address
//             </label>
//             <input
//               name="username"
//               type="email"
//               required
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="jane@example.com"
//               className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-4 focus:ring-[#f07c54]/5 transition-all"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="space-y-1.5">
//             <div className="flex justify-between items-center">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//                 Password
//               </label>
//               <Link
//                 href="/forgot-password"
//                 className="text-xs font-bold text-[#f07c54] hover:underline"
//               >
//                 Forgot?
//               </Link>
//             </div>
//             <input
//               name="password"
//               type="password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-4 focus:ring-[#f07c54]/5 transition-all"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#f07c54] hover:bg-[#e06b43] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#f07c54]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               "Signing in..."
//             ) : (
//               <>
//                 Sign in <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative my-8">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t border-slate-100"></span>
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-4 text-slate-400 font-medium tracking-widest">
//               Or continue with
//             </span>
//           </div>
//         </div>

//         {/* Social Buttons */}
//         <div className="grid grid-cols-2 gap-4">
//           <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors">
//             <FcGoogle className="h-5 w-5" /> Google
//           </button>
//           <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors">
//             <FaApple className="h-5 w-5" /> Apple
//           </button>
//         </div>

//         {/* Footer Link */}
//         <p className="mt-8 text-center text-sm text-slate-500">
//           New to Sketchboard?{" "}
//           <Link
//             href="/signup"
//             className="font-bold text-[#f07c54] hover:underline"
//           >
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
