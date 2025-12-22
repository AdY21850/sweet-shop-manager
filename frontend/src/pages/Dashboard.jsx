console.log("DASHBOARD FILE LOADED");

import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart } from "lucide-react";
import axios from "axios";

import AuthGuard from "../components/AuthGuard";
import Navbar from "../components/Navbar";
import AnimatedFooter from "../components/AnimatedFooter";

import { useSweets } from "../context/SweetsContext";
import { useCart } from "../context/CartContext";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

/* ================= Dashboard ================= */

export default function Dashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <DashboardContent />
        <AnimatedFooter />
      </div>
    </AuthGuard>
  );
}

/* ================= Hero Section ================= */

function DashboardHero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/hero/active`)
      .then((res) => setHero(res.data))
      .catch(() => {});
  }, []);

  return (
    <section
      className="mx-4 mt-6 mb-8 rounded-2xl overflow-hidden"
      style={{
        background:
          hero?.imageUrl
            ? `url(${hero.imageUrl}) center/cover`
            : "linear-gradient(to right, #ec4899, #8b5cf6)",
      }}
    >
      <div className="bg-black/50 px-8 py-12 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {hero?.title || "Welcome to Sweet Shop"}
        </h1>
        <p className="text-base md:text-lg">
          {hero?.description ||
            "Find your favourite sweets, fresh and delicious 🍬"}
        </p>
      </div>
    </section>
  );
}

/* ================= Main Content ================= */

function DashboardContent() {
  const { sweets } = useSweets();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 SIMPLE, WORKING SEARCH
  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet) =>
      sweet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sweets, searchQuery]);

  return (
    <>
      {/* HERO */}
      <DashboardHero />

      <main className="container mx-auto px-4 py-6">
        {/* SEARCH BAR */}
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* PRODUCTS */}
        <ProductsGrid sweets={filteredSweets} onAddToCart={addToCart} />

        {filteredSweets.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            No sweets found 🍬
          </p>
        )}
      </main>
    </>
  );
}

/* ================= Products Grid ================= */

function ProductsGrid({ sweets, onAddToCart }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sweets.map((sweet) => (
        <ProductCard
          key={sweet.id}
          sweet={sweet}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

/* ================= Product Card ================= */

function ProductCard({ sweet, onAddToCart }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={sweet.imageUrl || "/placeholder.svg"}
          alt={sweet.name}
          className="h-full w-full object-cover transition-transform hover:scale-110"
        />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">
              {sweet.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {sweet.category}
            </CardDescription>
          </div>
          <Badge variant={sweet.quantity > 0 ? "default" : "secondary"}>
            {sweet.quantity > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {sweet.description}
        </p>
        <p className="mt-2 text-2xl font-bold text-pink-600">
          ₹{sweet.price}
        </p>
        <p className="text-xs text-muted-foreground">
          Quantity: {sweet.quantity}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          disabled={sweet.quantity === 0}
          onClick={() => onAddToCart(sweet)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
