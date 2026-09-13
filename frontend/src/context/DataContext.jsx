import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    orders: [],
    investments: [],
    menu: [],
    categories: [],
    accounts: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.fetchData();
      setData(res);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loadData, loading }}>
      {children}
    </DataContext.Provider>
  );
};
