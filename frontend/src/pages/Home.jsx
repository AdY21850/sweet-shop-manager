import { Link } from "react-router-dom";
import { Candy, ShoppingBag, Sparkles, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";

/**
 * Home Page
 * Public landing page for Sweet Shop
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </main>
  );
}

/* ---------------- Hero Section ---------------- */




/* ---------------- Hero Section ---------------- */

function HeroSection() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/hero/active")
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Hero fetch failed", err));
  }, []);

  if (!hero) return null; // loading safe guard

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.imageUrl})` }}
    >
      <div className="bg-black/50">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center text-white">
          <Candy className="mx-auto mb-6 h-20 w-20 text-pink-300" />

          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            {hero.title}
          </h1>

          <p className="mb-8 text-lg md:text-xl">
            {hero.description}
          </p>

          <Button size="lg" asChild>
            <Link to="/register">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


function BackgroundDecorations() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[20%] top-[10%] h-64 w-64 animate-float rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute right-[10%] top-[30%] h-80 w-80 animate-float rounded-full bg-purple-300/30 blur-3xl" />
    </div>
  );
}

function PrimaryCTA() {
  return (
    <Button
      size="lg"
      asChild
      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
    >
      <Link to="/register">
        <ShoppingBag className="mr-2 h-5 w-5" />
        Start Shopping
      </Link>
    </Button>
  );
}

function SecondaryCTA() {
  return (
    <Button size="lg" variant="outline" asChild>
      <Link to="/login">Login</Link>
    </Button>
  );
}

/* ---------------- Features Section ---------------- */

function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Hand-picked selection of the finest sweets and candies",
      color: "text-pink-500",
    },
    {
      icon: ShoppingBag,
      title: "Easy Shopping",
      description:
        "Simple and secure checkout process with multiple payment options",
      color: "text-purple-500",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every product is crafted with passion and care",
      color: "text-pink-500",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Why Choose{" "}
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Sweet Shop
        </span>
        ?
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center shadow-lg transition-transform hover:scale-105">
      <Icon className={`mx-auto mb-4 h-12 w-12 ${color}`} />
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

/* ---------------- CTA Section ---------------- */

function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-20 text-center">
      <h2 className="mb-4 text-4xl font-bold text-white">
        Ready to Satisfy Your Sweet Tooth?
      </h2>
      <p className="mb-8 text-lg text-pink-100">
        Join thousands of happy customers and start your sweet journey today!
      </p>
      <Button size="lg" variant="secondary" asChild>
        <Link to="/register">Get Started Now</Link>
      </Button>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Sweet Shop. All rights reserved.
    </footer>
  );
}
