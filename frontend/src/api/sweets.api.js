import api from "./axios";

export const getSweets = () =>
  api.get("/sweets");

export const addSweetApi = (data) =>
  api.post("/sweets", data);

export const updateSweetApi = (id, data) =>
  api.put(`/sweets/${id}`, data);

export const deleteSweetApi = (id) =>
  api.delete(`/sweets/${id}`);
