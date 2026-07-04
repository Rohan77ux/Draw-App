"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Circle,
  Diamond,
  Image,
  Pencil,
  RectangleHorizontalIcon,
  Eraser,
  Type,
  X,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Minus,
  Plus,
  Minus as MinusIcon,
  MousePointer,
} from "lucide-react";
import { Game, Theme } from "@/app/draw/Game";
import { AnimatePresence, motion } from "framer-motion";
import { HTTP_BACKEND } from "@/config";
import toast, { Toaster } from "react-hot-toast";
import useWindowSize from "../app/hooks/useWindowSize";

export type Tool =
  | "circle"
  | "rect"
  | "pencil"
  | "diamond"
  | "arrow"
  | "line"
  | "text"
  | "image"
  | "eraser"
  | "cursor"
  | "selection";

const STROKE_COLORS_LIGHT = [
  { name: "black", hex: "#1e1e1e" },
  { name: "red", hex: "#e03131" },
  { name: "green", hex: "#2f9e44" },
  { name: "blue", hex: "#1971c2" },
  { name: "orange", hex: "#f08c00" },
];

const STROKE_COLORS_DARK = [
  { name: "white", hex: "#e9ecef" },
  { name: "red", hex: "#ff8787" },
  { name: "green", hex: "#69db7c" },
  { name: "blue", hex: "#74c0fc" },
  { name: "orange", hex: "#ffd43b" },
];

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("selection");
  const [theme, setTheme] = useState<Theme>("light");
  const [selectedColor, setSelectedColor] = useState(
    STROKE_COLORS_LIGHT[0].hex,
  );
  const [fontSize, setFontSize] = useState(20);
  const [view, setView] = useState({ scale: 1, panX: 0, panY: 0 });
  const { width, height } = useWindowSize();

  const palette = theme === "dark" ? STROKE_COLORS_DARK : STROKE_COLORS_LIGHT;

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial =
      saved ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    setSelectedColor(
      (initial === "dark" ? STROKE_COLORS_DARK : STROKE_COLORS_LIGHT)[0].hex,
    );
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      setSelectedColor(
        (next === "dark" ? STROKE_COLORS_DARK : STROKE_COLORS_LIGHT)[0].hex,
      );
      game?.setTheme(next);
      return next;
    });
  }, [game]);

  useEffect(() => {
    async function checkAccess() {
      const token = localStorage.getItem("Authorization");
      try {
        const res = await fetch(`${HTTP_BACKEND}/rooms/${roomId}/access`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 403) {
          toast.error("You are not allowed to access this room");
          window.location.href = "/room";
        }
      } catch (err) {
        console.error("Access check failed:", err);
        toast.error("Could not verify room access");
      }
    }
    checkAccess();
  }, [roomId]);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setColor(selectedColor);
  }, [selectedColor, game]);

  useEffect(() => {
    game?.setFontSize(fontSize);
  }, [fontSize, game]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const g = new Game(canvasRef.current, roomId, socket);
    g.setTheme(theme);
    g.setFontSize(fontSize);
    g.setOnViewChange(setView);
    setGame(g);
    return () => g.destroy();
  }, [canvasRef, roomId, socket]);

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    game?.redraw();
  }, [width, height, game]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair"
      />

      <Topbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        roomId={roomId}
        theme={theme}
        toggleTheme={toggleTheme}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        palette={palette}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <ZoomControls
        zoom={view.scale}
        onZoomIn={() => game?.zoomIn()}
        onZoomOut={() => game?.zoomOut()}
        onReset={() => game?.resetZoom()}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ZOOM CONTROLS                                                               */
/* -------------------------------------------------------------------------- */

function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-1 px-2 py-1.5 rounded-2xl
      shadow-xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700"
    >
      <button
        onClick={onZoomOut}
        className="p-2 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800 transition-all"
      >
        <ZoomOut size={16} />
      </button>
      <button
        onClick={onReset}
        className="px-2 text-sm font-medium text-gray-800 dark:text-gray-300 min-w-[52px]"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={onZoomIn}
        className="p-2 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800 transition-all"
      >
        <ZoomIn size={16} />
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* TOPBAR                                                                      */
/* -------------------------------------------------------------------------- */

function Topbar({
  selectedTool,
  setSelectedTool,
  roomId,
  theme,
  toggleTheme,
  selectedColor,
  setSelectedColor,
  palette,
  fontSize,
  setFontSize,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  roomId: string;
  theme: Theme;
  toggleTheme: () => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  palette: { name: string; hex: string }[];
  fontSize: number;
  setFontSize: (size: number) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: "selection", icon: <MousePointer size={18} /> },
    { id: "cursor", icon: <MousePointer2 size={18} /> },
    { id: "pencil", icon: <Pencil size={18} /> },
    { id: "line", icon: <Minus size={18} /> },
    { id: "rect", icon: <RectangleHorizontalIcon size={18} /> },
    { id: "circle", icon: <Circle size={18} /> },
    { id: "diamond", icon: <Diamond size={18} /> },
    { id: "arrow", icon: <ArrowRight size={18} /> },
    { id: "text", icon: <Type size={18} /> },
    { id: "image", icon: <Image size={18} /> },
    { id: "eraser", icon: <Eraser size={18} /> },
  ] as const;

  const handleFontSizeIncrease = () => setFontSize(Math.min(72, fontSize + 2));
  const handleFontSizeDecrease = () => setFontSize(Math.max(8, fontSize - 2));

  async function handleAdd() {
    if (!email.trim()) return toast.error("Please enter an email");
    setLoading(true);
    try {
      const user = await fetch(`${HTTP_BACKEND}/find-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((r) => r.json());
      if (!user?.id) {
        toast.error("❌ User not found");
        return;
      }
      const token = localStorage.getItem("Authorization");
      const res = await fetch(`${HTTP_BACKEND}/rooms/${roomId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) {
        toast.error("Failed to add collaborator");
        return;
      }
      toast.success("🎉 Collaborator added!");
      setShowModal(false);
      setEmail("");
    } catch (err) {
      console.error("Add collaborator failed:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center justify-center gap-4 max-w-[95vw]"
      >
        <Toaster position="top-right" />
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all"
          onClick={() => setShowModal(true)}
        >
          + Add Collaborator
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all"
          onClick={() => (window.location.href = `/room`)}
        >
          Go to Room
        </button>
        <div className="flex gap-2 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700">
          {tools.map((tool) => (
            <motion.button
              whileTap={{ scale: 0.92 }}
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as Tool)}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                selectedTool === tool.id
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-800 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800"
              }`}
            >
              {tool.icon}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl shadow-xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700">
          <button
            onClick={handleFontSizeDecrease}
            className="p-1 rounded-lg text-gray-800 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800 transition-all"
          >
            <MinusIcon size={16} />
          </button>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300 min-w-[32px] text-center">
            {fontSize}
          </span>
          <button
            onClick={handleFontSizeIncrease}
            className="p-1 rounded-lg text-gray-800 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2 px-3 py-2 rounded-2xl shadow-xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700">
          {palette.map((c) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(c.hex)}
              aria-label={c.name}
              className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === c.hex ? "border-indigo-500 scale-110" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl shadow-xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700 text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-slate-800 transition-all"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-[350px] bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-white/30 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add Collaborator</h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <input
                type="email"
                placeholder="Enter collaborator email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-800 focus:ring-2 ring-indigo-500 outline-none mb-4"
              />
              <button
                onClick={handleAdd}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                {loading ? "Adding..." : "Add Collaborator"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
