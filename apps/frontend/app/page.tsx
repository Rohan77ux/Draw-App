import React from "react";
import { Button } from "@/components/button";
import {
  Pencil,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Cloud,
  Palette,
  Lock,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

function page() {
  const FeatureCard = ({
    icon: Icon,
    title,
    description,
    color,
  }: FeatureCardProps) => {
    return (
      <div className="group p-6 rounded-2xl border border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
        <div
          className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    );
  };

  const CheckItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-foreground">{text}</span>
    </div>
  );

  const ShowcaseCanvas = () => {
    return (
      <div className="aspect-square p-6 relative bg-background">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Flow diagram */}
          {/* Start node */}
          <ellipse
            cx="200"
            cy="40"
            rx="60"
            ry="25"
            className="fill-green-300 stroke-black"
            strokeWidth="2"
            opacity="0.7"
          />
          <text
            x="200"
            y="45"
            textAnchor="middle"
            className="font-display text-sm fill-foreground"
          >
            Start
          </text>

          {/* Arrow down */}
          <path
            d="M 200 65 L 200 100"
            className=" stroke-black"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Process box 1 */}
          <rect
            x="120"
            y="110"
            width="160"
            height="50"
            rx="6"
            className="fill-blue-200 stroke-black"
            strokeWidth="2"
          />
          <text
            x="200"
            y="140"
            textAnchor="middle"
            className="text-sm fill-foreground"
          >
            User Research
          </text>

          {/* Arrow down */}
          <path
            d="M 200 160 L 200 190"
            className=" stroke-black"
            strokeWidth="2"
          />

          {/* Decision diamond */}
          <polygon
            points="200,200 260,240 200,280 140,240"
            className="fill-amber-300 stroke-black"
            strokeWidth="2"
            opacity="0.8"
          />
          <text
            x="200"
            y="245"
            textAnchor="middle"
            className="text-xs fill-foreground"
          >
            Valid?
          </text>

          {/* Yes path */}
          <path
            d="M 260 240 L 320 240 L 320 320"
            className=" stroke-blue-300"
            strokeWidth="2"
          />
          <text x="285" y="230" className="text-xs fill-accent">
            Yes
          </text>

          {/* No path */}
          <path
            d="M 140 240 L 80 240 L 80 135 L 120 135"
            className="fill-black stroke-orange-300"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x="100" y="230" className="text-white">
            No
          </text>

          {/* Final box */}
          <rect
            x="260"
            y="320"
            width="120"
            height="50"
            rx="6"
            className="fill-green-300 stroke-black"
            opacity="0.8"
          />
          <text
            x="320"
            y="350"
            textAnchor="middle"
            className="text-sm fill-primary-foreground"
          >
            Launch! 🚀
          </text>

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--foreground))"
              />
            </marker>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/70  backdrop-blur-md">
        {/* Your navbar content */}

        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#f06542] flex items-center justify-center">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans text-2xl font-bold ">Sketchboard</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#showcase"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Showcase
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3 ">
            <Button variant="ghost" size="sm">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold shadow hover:brightness-105 transition"
              >
                signin
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="sm" className="bg-[#f06542] text-white">
              Try Free
            </Button>
          </div>
        </div>
      </nav>

      <section className="min-h-screen bg-hero flex items-center justify-center pt-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 animate-float">
              <Sparkles className="w-4 h-4" />
              <span>Free to use, forever</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Sketch ideas{" "}
              <span className="relative inline-block">
                <span className="sketch-underline">together</span>
              </span>
              <br />
              <span className="font-display text-6xl md:text-8xl text-[#f06542]">
                beautifully
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create hand-drawn diagrams, wireframes, and visuals — together and
              in real time. Designed for speed, privacy, and beautiful exports.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                variant="hero"
                size="xl"
                className="bg-[#f06542] text-white"
              >
                Start Drawing
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                Watch Demo
              </Button>
            </div>

            {/* Canvas Preview */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-sketch-blue/20 rounded-3xl blur-2xl opacity-60" />
              <div className="relative bg-card-gradient rounded-2xl shadow-card border border-border/50 overflow-hidden">
                <CanvasPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="font-display text-[#f06542]">create</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple yet powerful tools designed for teams who think visually
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From concept to{" "}
                <span className="font-display text-[#f06542]">clarity</span>
                <br />
                in minutes
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're mapping user flows, sketching wireframes, or
                running a team retrospective — Sketchboard adapts to your
                workflow.
              </p>

              <div className="space-y-4 mb-8">
                <CheckItem text="Intuitive shape recognition" />
                <CheckItem text="Smart connectors that stay connected" />
                <CheckItem text="Export to PNG, SVG, or PDF" />
                <CheckItem text="Embed anywhere with live previews" />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="bg-[#f06542] text-white"
              >
                Explore Templates
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl" />
              <div className="relative bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
                <ShowcaseCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 400">
            <pattern
              id="cta-grid"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1.5"
                fill="hsl(var(--primary))"
                opacity="0.3"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>No credit card required</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to{" "}
              <span className="font-display text-[#f06542]">sketch</span> your
              ideas?
            </h2>

            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of teams who've already transformed how they
              visualize and collaborate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero"
                size="xl"
                className="bg-[#f06542] text-white"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                className="border-3 border-gray-200 hover:border-[#f06542]  hover:text-[#f06542] "
              >
                Talk to Sales
              </Button>
            </div>

            {/* Trust badges */}
            {/* <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60">
              <span className="text-sm text-muted-foreground">
                Trusted by teams at
              </span>
              <div className="flex items-center gap-8">
                {["Acme", "Globex", "Initech", "Hooli", "Pied Piper"].map(
                  (company) => (
                    <span
                      key={company}
                      className="font-semibold text-muted-foreground"
                    >
                      {company}
                    </span>
                  )
                )}
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-card border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f06542] flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white " />
              </div>
              <span className="font-display text-xl font-bold">
                Sketchboard
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                Features
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                Pricing
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                About
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                Blog
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors text-gray-400"
              >
                Terms
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm  text-gray-400">
              © 2026 Sketchboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const CanvasPreview = () => {
  return (
    <div className="aspect-video p-8 flex items-center justify-center relative">
      {/* Sketch elements */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450">
        {/* Grid dots */}
        <pattern
          id="dots"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="yellow" opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Sketchy rectangle */}
        <rect
          x="100"
          y="80"
          width="180"
          height="120"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          rx="4"
          className="fill-sky-100   animate-wiggle stroke-black"
          style={{ transformOrigin: "190px 140px" }}
        />
        <text
          x="190"
          y="145"
          textAnchor="middle"
          className="font-display text-lg fill-foreground"
        >
          Idea 1
        </text>

        {/* Arrow */}
        <path
          d="M 290 140 Q 350 120, 400 140"
          className="stroke-orange-400"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 4"
        />
        <polygon points="400,140 390,135 390,145" className="fill-orange-400" />

        {/* Circle */}
        <circle
          cx="500"
          cy="140"
          r="60"
          className="fill-yellow-200  stroke-black"
          strokeWidth="2"
          opacity="0.8"
        />
        <text
          x="500"
          y="145"
          textAnchor="middle"
          className="font-display text-lg fill-foreground"
        >
          Idea 2
        </text>

        {/* Diamond */}
        <polygon
          points="650,80 720,140 650,200 580,140"
          className="fill-green-300 stroke-black"
          strokeWidth="2"
          opacity="0.6"
        />
        <text
          x="650"
          y="145"
          textAnchor="middle"
          className="font-display text-lg fill-foreground"
        >
          Idea 3
        </text>

        {/* Connecting lines */}
        <path
          d="M 500 200 C 500 280, 300 280, 300 320"
          className="stroke-green-400"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="5 5"
        />

        {/* Notes box */}
        <rect
          x="200"
          y="300"
          width="200"
          height="80"
          className="fill-white stroke-zinc-500"
          strokeWidth="2"
          rx="8"
        />
        <text x="220" y="335" className="text-sm fill-muted-foreground">
          ✏️ Quick notes here...
        </text>
        <text x="220" y="360" className="text-sm fill-muted-foreground">
          • Brainstorm session
        </text>
      </svg>

      {/* Cursor indicators */}
      <div className="absolute bottom-12 right-24 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft text-sm">
        <div className="w-3 h-3 rounded-full bg-accent" />
        <span className="text-muted-foreground">Sarah is editing</span>
      </div>
    </div>
  );
};

const features = [
  {
    icon: Pencil,
    title: "Hand-drawn feel",
    description:
      "Create diagrams that look naturally sketched. Perfect for brainstorming without the pressure of perfection.",
    color: "bg-orange-100 text-[#f06542]",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Work together with your team instantly. See cursors, changes, and comments as they happen.",
    color: "bg-green-100 text-green-400",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "No lag, no waiting. Our canvas is optimized for smooth drawing even with thousands of elements.",
    color: "bg-amber-100 text-foreground",
  },
  {
    icon: Cloud,
    title: "Auto-save & sync",
    description:
      "Never lose your work. Everything syncs automatically across all your devices.",
    color: "bg-blue-100 text-blue-400",
  },
  {
    icon: Palette,
    title: "Endless customization",
    description:
      "Choose from beautiful color palettes, fonts, and styles to make your boards uniquely yours.",
    color: "bg-purple-100 text-purple-400",
  },
  {
    icon: Lock,
    title: "Privacy first",
    description:
      "End-to-end encryption keeps your ideas safe. You own your data, always.",
    color: "bg-green-100 text-green-400",
  },
];

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export default page;
