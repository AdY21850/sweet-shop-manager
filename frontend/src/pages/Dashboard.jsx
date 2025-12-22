import { useState, useMemo, useEffect } from "react";
import { Search, Filter, X, ShoppingCart } from "lucide-react";
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

/* ================= Hero ================= */

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
      className="mb-10 rounded-3xl overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: hero?.imageUrl
          ? `url(${hero.imageUrl})`
          : "linear-gradient(to right, #ec4899, #8b5cf6)",
      }}
    >
      <div className="bg-black/50 px-8 py-16 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {hero?.title || "Welcome to Sweet Shop"}
        </h1>
        <p className="text-lg">
          {hero?.description ||
            "Discover delicious sweets curated just for you 🍬"}
        </p>
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
    <>
      <DashboardHero />

      <main className="container mx-auto px-4 py-8">
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
    </>
  );
}

/* ================= Search & Filters ================= */

function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  hasActiveFilters,
  clearFilters,
}) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid gap-4 md:grid-cols-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-500">Under ₹500</SelectItem>
              <SelectItem value="500-1000">₹500 – ₹1000</SelectItem>
              <SelectItem value="over-1000">Above ₹1000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

/* ================= Helpers ================= */

function ResultsCount({ count }) {
  return (
    <p className="mb-4 text-sm text-muted-foreground">
      Showing {count} items
    </p>
  );
}

function EmptyState({ onClearFilters }) {
  return (
    <div className="mt-12 text-center">
      <p className="mb-4 text-lg">No sweets found 🍬</p>
      <Button onClick={onClearFilters}>Clear Filters</Button>
    </div>
  );
}

/* ================= Hooks ================= */

function useCategories(sweets) {
  return useMemo(() => {
    const set = new Set(sweets.map((s) => s.category));
    return ["all", ...Array.from(set)];
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
            <CardTitle className="line-clamp-1">{sweet.name}</CardTitle>
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
