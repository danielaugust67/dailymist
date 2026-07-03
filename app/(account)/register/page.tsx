"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.message || "Something went wrong");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative pt-20 min-h-screen">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGFr_gNkIi8_-mWVqyD9lxCEHR483Z1BVMzKaSTdTufuYN1YLDeQuZc6HYp6ta3xK_P1nQcCTtthkT3VvmHaBZlu7wZxHv600oaPzDY6lRgGNG2cQov_bndNtQRLk-q7csTONEsFkq7lKyZiKhGa7EWOjO9nyf8H4Gmm87phW0Tznx0oAGW4tRIyscqAo9wBk5Z5Fgrc9B6aaGA-eDP37e8BHbYB-Y5VWssL816qIvFiHHka326m499g')" }}
        />
        <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-margin-mobile my-12">
        <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(45,41,38,0.04)] p-8 md:p-10 border border-outline-variant/20">
          <div className="text-center mb-10">
            <h1 className="font-headline-md text-headline-md text-on-background mb-2">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Begin your sensory journey with us.</p>
          </div>

          {error && <div className="mb-4 text-error text-sm text-center font-body-md">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="relative group">
              <input 
                {...register("name")}
                id="full_name" 
                type="text" 
                className="w-full h-14 bg-white border-b border-outline-variant focus:border-on-background focus:ring-0 px-3 outline-none transition-all font-body-md peer placeholder-transparent" 
                placeholder="NAME"
              />
              <label 
                htmlFor="full_name" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-label-caps font-label-caps transition-all peer-focus:top-0 peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:left-2 peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:left-2"
              >
                NAME
              </label>
              {errors.name && <span className="text-error text-xs block font-body-md">{errors.name.message}</span>}
            </div>

            <div className="relative group">
              <input 
                {...register("email")}
                id="email" 
                type="email" 
                className="w-full h-14 bg-white border-b border-outline-variant focus:border-on-background focus:ring-0 px-3 outline-none transition-all font-body-md peer placeholder-transparent" 
                placeholder="EMAIL"
              />
              <label 
                htmlFor="email" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-label-caps font-label-caps transition-all peer-focus:top-0 peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:left-2 peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:left-2"
              >
                EMAIL
              </label>
              {errors.email && <span className="text-error text-xs block font-body-md">{errors.email.message}</span>}
            </div>

            <div className="relative group">
              <input 
                {...register("password")}
                id="password" 
                type="password" 
                className="w-full h-14 bg-white border-b border-outline-variant focus:border-on-background focus:ring-0 px-3 outline-none transition-all font-body-md peer placeholder-transparent" 
                placeholder="PASSWORD"
              />
              <label 
                htmlFor="password" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-label-caps font-label-caps transition-all peer-focus:top-0 peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:left-2 peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:left-2"
              >
                PASSWORD
              </label>
              {errors.password && <span className="text-error text-xs block font-body-md">{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-on-background text-on-primary rounded-lg font-label-caps text-label-caps tracking-widest hover:bg-secondary transition-colors duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "REGISTERING..." : "REGISTER"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-secondary">
              Already have an account? 
              <Link href="/login" className="text-on-background font-semibold hover:underline underline-offset-4 decoration-outline-variant ml-1">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
