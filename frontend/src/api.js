import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchData = async () => {
  const res = await axios.get(`${API_URL}/data`);
  return res.data;
};

export const createOrder = async (order) => {
  const res = await axios.post(`${API_URL}/orders`, order);
  return res.data;
};

export const updateOrder = async (id, order) => {
  const res = await axios.put(`${API_URL}/orders/${id}`, order);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${API_URL}/orders/${id}`);
  return res.data;
};

export const createInvestment = async (investment) => {
  const res = await axios.post(`${API_URL}/investments`, investment);
  return res.data;
};

export const updateInvestment = async (id, investment) => {
  const res = await axios.put(`${API_URL}/investments/${id}`, investment);
  return res.data;
};

export const deleteInvestment = async (id) => {
  const res = await axios.delete(`${API_URL}/investments/${id}`);
  return res.data;
};

export const createMenuItem = async (item) => {
  const res = await axios.post(`${API_URL}/menu`, item);
  return res.data;
};

export const updateMenuItem = async (id, item) => {
  const res = await axios.put(`${API_URL}/menu/${id}`, item);
  return res.data;
};

export const deleteMenuItem = async (id) => {
  const res = await axios.delete(`${API_URL}/menu/${id}`);
  return res.data;
};

export const updateSettings = async (settings) => {
  const res = await axios.put(`${API_URL}/settings`, settings);
  return res.data;
};

export const importData = async (data) => {
  const res = await axios.post(`${API_URL}/data/import`, data);
  return res.data;
};

export const resetData = async () => {
  const res = await axios.post(`${API_URL}/data/reset`);
  return res.data;
};
