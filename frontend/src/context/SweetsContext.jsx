import { createContext, useContext, useEffect, useState } from "react";
import {
  getSweets,
  addSweetApi,
  updateSweetApi,
  deleteSweetApi,
} from "../api/sweets.api";

const SweetsContext = createContext(null);

export function SweetsProvider({ children }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      const res = await getSweets();
      setSweets(res.data);
    } catch (err) {
      console.error("Failed to load sweets:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSweet = async (sweet) => {
    await addSweetApi(sweet);
    loadSweets();
  };

  const updateSweet = async (id, data) => {
    await updateSweetApi(id, data);
    loadSweets();
  };

  const deleteSweet = async (id) => {
    await deleteSweetApi(id);
    loadSweets();
  };

  return (
    <SweetsContext.Provider
      value={{ sweets, loading, addSweet, updateSweet, deleteSweet }}
    >
      {children}
    </SweetsContext.Provider>
  );
}

export const useSweets = () => {
  const ctx = useContext(SweetsContext);
  if (!ctx) {
    throw new Error("useSweets must be used inside SweetsProvider");
  }
  return ctx;
};
