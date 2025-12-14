import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import AnimatedFooter from "../components/AnimatedFooter";
import { Button } from "../components/ui/button";

export default function Checkout() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    totalPrice,
  } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                {/* Image + Name */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => updateCartQuantity(item.id, -1)}
                  >
                    -
                  </Button>
                  <span className="font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => updateCartQuantity(item.id, 1)}
                  >
                    +
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold">
                    ₹{item.price * item.quantity}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <Button
                onClick={placeOrder}
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
  );
}
