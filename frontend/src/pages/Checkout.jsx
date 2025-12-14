import AuthGuard from "../components/AuthGuard";
import Navbar from "../components/Navbar";
import AnimatedFooter from "../components/AnimatedFooter";

import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";

export default function Checkout() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    totalPrice,
  } = useCart();

  async function handleCheckout() {
    if (cart.length === 0) return;

    await placeOrder();
    alert("✅ Order placed successfully!");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Checkout</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateCartQuantity(item.id, -1)
                      }
                    >
                      −
                    </Button>

                    <span className="w-6 text-center">
                      {item.quantity}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateCartQuantity(item.id, 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Place Order
                </Button>
              </div>
            </>
          )}
        </div>

        <AnimatedFooter />
      </div>
    </AuthGuard>
  );
}
