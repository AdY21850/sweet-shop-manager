import { useState, useMemo, useEffect } from "react";
import { Search, Filter, X, ShoppingCart } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

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

/* ================= Dashboard Hero ================= */

function DashboardHero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/hero/active")
      .then((res) => res.json())
      .then(setHero)
      .catch(() => {});
  }, []);

  if (!hero) return null;

  return (
    <section
      className="mb-10 rounded-3xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.imageUrl})` }}
    >
      <div className="bg-black/50">
        <div className="px-8 py-16 max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {hero.title}
          </h1>
          <p className="text-lg text-white/90">
            {hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= Main ================= */

function DashboardContent() {
  const { sweets } = useSweets();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useCategories(sweets);
  const filteredSweets = useFilteredSweets(
    sweets,
    searchQuery,
    selectedCategory,
    priceRange
  );

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || priceRange !== "all";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 🔥 HERO SECTION */}
      <DashboardHero />

      <SearchAndFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <ResultsCount count={filteredSweets.length} />

      <ProductsGrid sweets={filteredSweets} onAddToCart={addToCart} />

      {filteredSweets.length === 0 && (
        <EmptyState onClearFilters={clearFilters} />
      )}
    </main>
  );
}

/* ================= Hooks ================= */

function useCategories(sweets) {
  return useMemo(() => {
    const categories = new Set(sweets.map((s) => s.category));
    return ["all", ...Array.from(categories)];
  }, [sweets]);
}

function useFilteredSweets(sweets, search, category, priceRange) {
  return useMemo(() => {
    return sweets.filter((sweet) => {
      const matchesSearch = sweet.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || sweet.category === category;

      let matchesPrice = true;
      if (priceRange === "under-500") matchesPrice = sweet.price < 500;
      if (priceRange === "500-1000")
        matchesPrice = sweet.price >= 500 && sweet.price <= 1000;
      if (priceRange === "over-1000") matchesPrice = sweet.price > 1000;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, search, category, priceRange]);
}

/* ================= Grid ================= */

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

/* ================= Card ================= */

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

/* ================= Helpers ================= */

function SearchAndFilters() { return null }
function ResultsCount() { return null }
function EmptyState() { return null }
