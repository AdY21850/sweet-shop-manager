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
 * Login Page
 * Handles user authentication
 */
export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 p-4 dark:from-pink-950 dark:via-purple-950 dark:to-pink-900">
      <BackgroundDecorations />
      <LoginCard />
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

/* ---------------- Login Card ---------------- */

function LoginCard() {
  return (
    <Card className="relative w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <Logo />
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Login to your Sweet Shop account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
        <RegisterRedirect />
        <DemoCredentials />
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

/* ---------------- Login Form ---------------- */

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {isLoading ? "Logging in..." : "Login"}
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

function RegisterRedirect() {
  return (
    <div className="mt-4 text-center text-sm">
      Don&apos;t have an account?{" "}
      <Link
        to="/register"
        className="font-medium text-pink-600 hover:underline dark:text-pink-400"
      >
        Register
      </Link>
    </div>
  );
}

function DemoCredentials() {
  return (
    <div className="mt-4 rounded-lg bg-pink-50 p-3 text-xs dark:bg-pink-950">
      <p className="font-semibold">Demo Credentials:</p>
      <p>Admin: admin@sweetshop.com</p>
      <p>User: user@example.com</p>
      <p>Password: any password</p>
    </div>
  );
}
