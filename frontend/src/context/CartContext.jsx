import { createContext, useContext, useMemo, useState } from "react";
import { purchaseSweetApi } from "../api/sweets.api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ ADD TO CART
  const addToCart = (sweet) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === sweet.id);
      if (existing) {
        return prev.map((i) =>
          i.id === sweet.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          id: sweet.id,
          name: sweet.name,
          price: sweet.price,
          imageUrl: sweet.imageUrl,
          quantity: 1,
        },
      ];
    });
  };

  // ✅ UPDATE QUANTITY (+ / -)
  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ CLEAR CART
  const clearCart = () => setCart([]);

  // ✅ PLACE ORDER (🔥 DB quantity reduced)
  const placeOrder = async () => {
    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        await purchaseSweetApi(item.id);
      }
    }
    clearCart();
  };

  // ✅ DERIVED VALUES
  const getCartCount = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        getCartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
