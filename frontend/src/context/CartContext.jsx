import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("sweetshop_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sweetshop_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (sweet) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === sweet.id);
      if (existing) {
        return prev.map((i) =>
          i.id === sweet.id
            ? { ...i, cartQuantity: i.cartQuantity + 1 }
            : i
        );
      }
      return [...prev, { ...sweet, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const getCartCount = () =>
    cart.reduce((total, item) => total + item.cartQuantity, 0);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
