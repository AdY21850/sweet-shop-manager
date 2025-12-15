import api from "./axios";

// 🔓 Public - list sweets
export const getSweets = () => api.get("/api/sweets");

// 🔒 ADMIN only
export const addSweetApi = (data) => api.post("/api/sweets", data);

export const updateSweetApi = (id, data) =>
  api.put(`/api/sweets/${id}`, data);

export const deleteSweetApi = (id) =>
  api.delete(`/api/sweets/${id}`);

// 🔥 USER - purchase sweet
export const purchaseSweetApi = (id) =>
  api.put(`/api/sweets/${id}/purchase`);
