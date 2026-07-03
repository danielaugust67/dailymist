"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginFormValues = z.infer<typeof loginSchema>;

function getSafeRedirect() {
  if (typeof window === "undefined") return "/";

  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }

  return redirect;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.message || "Something went wrong");
      } else {
        router.push(getSafeRedirect());
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff8f5" }}>

      {/* Header */}
      <header
        className="fixed top-0 w-full z-50 border-b border-outline-variant/30"
        style={{ background: "rgba(252,249,248,0.8)", backdropFilter: "blur(20px)" }}
      >
        <div
          className="flex justify-between items-center h-20 max-w-[1280px] mx-auto"
          style={{ paddingLeft: "64px", paddingRight: "64px" }}
        >
          <Link
            href="/"
            className="hover:opacity-70 transition-opacity text-on-background"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            DailyMist
          </Link>
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:opacity-70 transition-opacity flex items-center">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden" style={{ paddingTop: "80px" }}>
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGFr_gNkIi8_-mWVqyD9lxCEHR483Z1BVMzKaSTdTufuYN1YLDeQuZc6HYp6ta3xK_P1nQcCTtthkT3VvmHaBZlu7wZxHv600oaPzDY6lRgGNG2cQov_bndNtQRLk-q7csTONEsFkq7lKyZiKhGa7EWOjO9nyf8H4Gmm87phW0Tznx0oAGW4tRIyscqAo9wBk5Z5Fgrc9B6aaGA-eDP37e8BHbYB-Y5VWssL816qIvFiHHka326m499g"
            alt="Background"
          />
          <div className="absolute inset-0" style={{ background: "rgba(253,251,247,0.6)", backdropFilter: "blur(4px)" }} />
        </div>

        {/* Login Card */}
        <section className="relative z-10 w-full flex justify-center" style={{ padding: "0 20px" }}>
          <div
            className="w-full animate-fade-up"
            style={{
              maxWidth: "420px",
              background: "#ffffff",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(45,41,38,0.06)",
              border: "1px solid rgba(198,199,192,0.2)"
            }}
          >
            <header className="text-center mb-10">
              <h1
                className="text-on-surface mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", lineHeight: "40px", fontWeight: 400 }}
              >
                Welcome Back
              </h1>
              <p
                className="text-on-surface-variant italic"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
              >
                Enter your essence to continue
              </p>
            </header>

            {error && (
              <div
                className="mb-4 text-center"
                style={{ color: "#ba1a1a", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
              >
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="floating-label-group">
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-transparent rounded-lg outline-none transition-all"
                  style={{
                    border: "1px solid #c6c7c0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "#1e1b18",
                  }}
                  placeholder=" "
                />
                <label htmlFor="email">EMAIL ADDRESS</label>
                {errors.email && (
                  <span style={{ color: "#ba1a1a", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="floating-label-group">
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 bg-transparent rounded-lg outline-none transition-all"
                  style={{
                    border: "1px solid #c6c7c0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "#1e1b18",
                  }}
                  placeholder=" "
                />
                <label htmlFor="password">PASSWORD</label>
                {errors.password && (
                  <span style={{ color: "#ba1a1a", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="hover:text-on-background transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", color: "#454742" }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg tracking-widest hover:bg-secondary transition-all active:scale-[0.98] duration-200 disabled:opacity-50"
                style={{
                  background: "#1b1c1c",
                  color: "#ffffff",
                  padding: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {isLoading ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-on-surface-variant"
                  style={{ background: "#ffffff", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
                >
                  Or
                </span>
              </div>
            </div>

            <button
              className="w-full border border-outline-variant text-on-surface rounded-lg flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all active:scale-[0.98]"
              style={{ padding: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <footer className="mt-8 text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#454742" }}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold border-b border-on-background hover:text-secondary transition-colors ml-1"
                  style={{ color: "#1b1c1c", borderColor: "#1b1c1c" }}
                >
                  Register
                </Link>
              </p>
            </footer>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="w-full border-t border-outline-variant/20"
        style={{ padding: "48px 64px", background: "#fff8f5" }}
      >
        <div
          className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto space-y-4 md:space-y-0"
        >
          <span
            className="text-outline tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            DAILYMIST
          </span>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-secondary hover:text-primary transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-secondary" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
            © 2024 DailyMist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
