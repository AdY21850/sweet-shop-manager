import { useState, useMemo } from "react";
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

/**
 * Dashboard Page
 * Displays sweets catalog with search & filters
 */
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

/* ---------------- Main Content ---------------- */

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
      <Header />

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

/* ---------------- Hooks ---------------- */

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

/* ---------------- UI Components ---------------- */

function Header() {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-4xl font-bold">
        Our{" "}
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Sweet Collection
        </span>
      </h1>
      <p className="text-muted-foreground">
        Discover delicious treats for every taste
      </p>
    </div>
  );
}

function SearchAndFilters(props) {
  const {
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
  } = props;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <FiltersPanel
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      )}

      {hasActiveFilters && (
        <ActiveFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
          setPriceRange={setPriceRange}
          clearFilters={clearFilters}
        />
      )}
    </div>
  );
}

function FiltersPanel({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FilterSelect
          label="Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories}
        />
        <FilterSelect
          label="Price Range"
          value={priceRange}
          onChange={setPriceRange}
          options={[
            "all",
            "under-500",
            "500-1000",
            "over-1000",
          ]}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ActiveFilters({
  searchQuery,
  selectedCategory,
  priceRange,
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  clearFilters,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Active filters:
      </span>

      {searchQuery && (
        <FilterBadge
          label={`Search: ${searchQuery}`}
          onClear={() => setSearchQuery("")}
        />
      )}

      {selectedCategory !== "all" && (
        <FilterBadge
          label={selectedCategory}
          onClear={() => setSelectedCategory("all")}
        />
      )}

      {priceRange !== "all" && (
        <FilterBadge
          label={priceRange}
          onClear={() => setPriceRange("all")}
        />
      )}

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all
      </Button>
    </div>
  );
}

function FilterBadge({ label, onClear }) {
  return (
    <Badge variant="secondary" className="gap-1">
      {label}
      <X className="h-3 w-3 cursor-pointer" onClick={onClear} />
    </Badge>
  );
}

function ResultsCount({ count }) {
  return (
    <p className="mb-4 text-sm text-muted-foreground">
      Showing {count} {count === 1 ? "item" : "items"}
    </p>
  );
}

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

function ProductCard({ sweet, onAddToCart }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={sweet.image || "/placeholder.svg"}
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
          <Badge
            variant={sweet.quantity > 0 ? "default" : "secondary"}
          >
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

function EmptyState({ onClearFilters }) {
  return (
    <div className="py-20 text-center">
      <p className="text-lg text-muted-foreground">
        No sweets found matching your criteria.
      </p>
      <Button variant="link" onClick={onClearFilters} className="mt-2">
        Clear all filters
      </Button>
    </div>
  );
}
