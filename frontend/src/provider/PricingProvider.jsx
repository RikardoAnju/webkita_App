import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../utils/api";
import { ENDPOINTS } from "../utils/endpoints"; // sesuaikan path-nya

const PricingContext = createContext(null);

export const PricingProvider = ({ children }) => {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(ENDPOINTS.GET_PUBLIC_PRICING);
      const data = res?.data?.data ?? res?.data ?? [];
      setPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || "Gagal memuat paket";
      setError(message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const getPlanByTier = useCallback(
    (tier) => plans.find((p) => p.tier === tier) ?? null,
    [plans]
  );

  return (
    <PricingContext.Provider value={{ plans, loading, error, refetch: fetchPlans, getPlanByTier }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const ctx = useContext(PricingContext);
  if (!ctx) throw new Error("usePricing harus dipakai di dalam PricingProvider");
  return ctx;
};