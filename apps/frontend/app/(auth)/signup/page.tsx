"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { AuthPage } from "../../../components/AuthPage";
import { useState } from "react";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    };

    try {
      await axios.post(`${HTTP_BACKEND}/signup`, userData);
      router.push("/login");
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return <AuthPage isSignin={false} handle={handleSignup} loading={loading} />;
}

// "use client";

// import React, { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { Pencil, ArrowRight } from "lucide-react"; // Matching your logo style
// import Link from "next/link";
// import axios from "axios";

// export default function SignUpForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
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
//       const response = await axios.post(
//         "http://localhost:4000/signup",
//         formData
//       );
//       setMessage({ type: "success", text: "Account created successfully!" });
//     } catch (error: any) {
//       const errorMsg = error.response?.data?.message || "Signup failed";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Background matches the slight off-white of your landing page
//     <div className="min-h-screen bg-[#fffcf9] flex flex-col items-center justify-center p-6 text-slate-900">
//       {/* Small Logo / Back to Home Link */}
//       <Link href="/" className="mb-8 flex items-center gap-2 group">
//         <div className="bg-[#f07c54] p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
//           <Pencil className="w-5 h-5 text-white" />
//         </div>
//         <span className="font-bold text-xl tracking-tight">Sketchboard</span>
//       </Link>

//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold tracking-tight mb-2">
//             Create an account
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Join Sketchboard and start ideas together.
//           </p>
//         </div>

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
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//                 First Name
//               </label>
//               <input
//                 name="firstName"
//                 type="text"
//                 required
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="Jane"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-2 focus:ring-[#f07c54]/10 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//                 Last Name
//               </label>
//               <input
//                 name="lastName"
//                 type="text"
//                 required
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Doe"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-2 focus:ring-[#f07c54]/10 transition-all"
//               />
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//               Email
//             </label>
//             <input
//               name="username"
//               type="email"
//               required
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="jane@example.com"
//               className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-2 focus:ring-[#f07c54]/10 transition-all"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
//               Password
//             </label>
//             <input
//               name="password"
//               type="password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-[#f07c54] focus:ring-2 focus:ring-[#f07c54]/10 transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#f07c54] hover:bg-[#e06b43] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#f07c54]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               "Creating account..."
//             ) : (
//               <>
//                 Create account <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="relative my-8">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t border-slate-100"></span>
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-4 text-slate-400 font-medium">
//               Or continue with
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors">
//             <FcGoogle className="h-5 w-5" /> Google
//           </button>
//           <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors">
//             <FaApple className="h-5 w-5" /> Apple
//           </button>
//         </div>

//         <p className="mt-8 text-center text-sm text-slate-500">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-bold text-[#f07c54] hover:underline"
//           >
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
