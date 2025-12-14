import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Candy } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

/**
 * Register Page
 * Handles new user registration
 */
export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 p-4 dark:from-pink-950 dark:via-purple-950 dark:to-pink-900">
      <BackgroundDecorations />
      <RegisterCard />
    </div>
  );
}

/* ---------------- Background ---------------- */

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[20%] top-[20%] h-64 w-64 animate-float rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute right-[20%] bottom-[20%] h-64 w-64 animate-float rounded-full bg-purple-300/30 blur-3xl" />
    </div>
  );
}

/* ---------------- Register Card ---------------- */

function RegisterCard() {
  return (
    <Card className="relative w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <Logo />
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Sign up for your Sweet Shop account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />
        <LoginRedirect />
      </CardContent>
    </Card>
  );
}

function Logo() {
  return (
    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
      <Candy className="h-6 w-6 text-white" />
    </div>
  );
}

/* ---------------- Register Form ---------------- */

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // ✅ MATCH BACKEND DTO EXACTLY
      await register({
        username: name,
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
  console.error("Registration failed");
  console.error("STATUS:", error.response?.status);
  console.error("DATA:", error.response?.data);
}

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Name"
        type="text"
        value={name}
        onChange={setName}
        placeholder="John Doe"
      />

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />

      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
      >
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}

/* ---------------- Reusable Input ---------------- */

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function LoginRedirect() {
  return (
    <div className="mt-4 text-center text-sm">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-medium text-pink-600 hover:underline dark:text-pink-400"
      >
        Login
      </Link>
    </div>
  );
}
