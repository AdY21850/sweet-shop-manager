import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Wallet,
} from "lucide-react";

import AuthGuard from "../components/AuthGuard";
import Navbar from "../components/Navbar";
import AnimatedFooter from "../components/AnimatedFooter";
import { useCart } from "../context/CartContext";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function Checkout() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "card",
  });

  /* ---------------- Pricing ---------------- */
  const tax = Math.round(cartTotal * 0.18);
  const shipping = cartTotal > 1000 ? 0 : 50;
  const total = cartTotal + tax + shipping;

  /* ---------------- Handlers ---------------- */
  const handleCheckout = (e) => {
    e.preventDefault();

    /**
     * In real app:
     * POST /api/orders or /api/sweets/purchase
     * Backend:
     * - validates stock
     * - updates inventory
     * - creates order
     */
    clearCart();
    alert(`Order placed successfully!\nTotal: ₹${total}`);

    navigate("/dashboard");
  };

  /* ---------------- Empty Cart ---------------- */
  if (cart.length === 0) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">
              Add some delicious sweets to get started!
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Browse Sweets
            </Button>
          </main>
          <AnimatedFooter />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-4xl font-bold">
            Checkout{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Summary
            </span>
          </h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                  <CardDescription>
                    Review your selected sweets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-24 w-24 rounded-lg object-cover"
                      />

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="mt-1 font-bold text-pink-600">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.cartQuantity - 1
                              )
                            }
                            disabled={item.cartQuantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center font-semibold">
                            {item.cartQuantity}
                          </span>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.cartQuantity + 1
                              )
                            }
                            disabled={item.cartQuantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right font-bold">
                        ₹{item.price * item.cartQuantity}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">₹{total}</span>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                  {!showCheckoutForm ? (
                    <Button
                      className="w-full"
                      onClick={() => setShowCheckoutForm(true)}
                    >
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <form onSubmit={handleCheckout} className="w-full space-y-3">
                      <Input
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Phone"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      <Button type="submit" className="w-full">
                        Place Order – ₹{total}
                      </Button>
                    </form>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>

        <AnimatedFooter />
      </div>
    </AuthGuard>
  );
}
