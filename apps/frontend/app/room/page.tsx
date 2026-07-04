"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Plus, DoorOpen, X, Home } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Room {
  id: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function RoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("Authorization");
    const token = storedToken?.startsWith("Bearer ")
      ? storedToken
      : `Bearer ${storedToken}`;

    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }
    fetchUserData(token);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/me`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.data?.user) throw new Error("Invalid user data");

      setUser(response.data.user);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    router.push("/signin");
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return toast.error("Enter a valid room name");

    setIsCreatingRoom(true);
    try {
      const storedToken = localStorage.getItem("Authorization");
      const token = storedToken?.startsWith("Bearer ")
        ? storedToken
        : `Bearer ${storedToken}`;

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: newRoomName },
        { headers: { Authorization: token } },
      );

      setRooms((prev) => [...prev, response.data.room]);
      setNewRoomName("");
      toast.success("Room created!");
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating room");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.name || "User"}
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-lg">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all border border-slate-700/50"
            >
              <Home size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all border border-slate-700/50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Rooms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room, i) => (
              <motion.button
                key={room.id}
                onClick={() => router.push(`/canvas/${room.id}`)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-left transition-all hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {room.slug}
                  </h2>
                  <DoorOpen
                    className="text-slate-500 group-hover:text-indigo-400 transition-colors"
                    size={20}
                  />
                </div>
                <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  Active
                </div>
              </motion.button>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-slate-400 text-lg">
                No rooms yet — create your first one!
              </p>
            </motion.div>
          )}
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all z-50"
        >
          <Plus size={24} />
        </motion.button>

        {/* Create Room Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Create a new room
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter room name..."
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createRoom()}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createRoom}
                    disabled={isCreatingRoom}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all disabled:opacity-50"
                  >
                    {isCreatingRoom ? "Creating..." : "Create"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
