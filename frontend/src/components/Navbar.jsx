import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User, Candy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";

/**
 * Navbar
 * Displays navigation, user info, cart status, and role-based links
 */
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
          <Candy className="h-6 w-6 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Sweet Shop
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Link */}
          {isAdmin && (
            <Button variant="ghost" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" className="relative" asChild>
            <Link to="/checkout">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>

          {/* Logout */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
