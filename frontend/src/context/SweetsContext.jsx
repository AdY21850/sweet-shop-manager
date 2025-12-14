import { createContext, useContext, useEffect, useState } from "react";
import {
  getSweets,
  addSweetApi,
  updateSweetApi,
  deleteSweetApi,
} from "../api/sweets.api";

const SweetsContext = createContext(null);

const normalizeSweetPayload = (sweet) => ({
  name: sweet.name?.trim() || "",
  category: sweet.category?.trim() || "",
  price: Number(sweet.price),
  quantity: Number(sweet.quantity),
  imageUrl: sweet.imageUrl?.trim() || "",
  description: sweet.description?.trim() || "",
});

export function SweetsProvider({ children }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    const res = await getSweets();
    setSweets(res.data);
    setLoading(false);
  };

  const addSweet = async (sweet) => {
    await addSweetApi(normalizeSweetPayload(sweet));
    await loadSweets();
  };

  const updateSweet = async (id, sweet) => {
    await updateSweetApi(id, normalizeSweetPayload(sweet));
    await loadSweets();
  };

  const deleteSweet = async (id) => {
    await deleteSweetApi(id);
    await loadSweets();
  };

  return (
    <SweetsContext.Provider
      value={{ sweets, loading, loadSweets, addSweet, updateSweet, deleteSweet }}
    >
      {children}
    </SweetsContext.Provider>
  );
}

export const useSweets = () => useContext(SweetsContext);
