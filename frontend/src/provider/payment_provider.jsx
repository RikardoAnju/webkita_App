import React, { createContext, useContext, useState } from "react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/constants/api_endpoint";

const extractErrorMessage = (err) => {
    if (typeof err === "string") return err;
    return (
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan pada server"
    );
};

const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentData, setPaymentData] = useState(null);

    const clearError = () => setError("");

    // --- 1. BUAT TRANSAKSI ---
    const createTransaction = async (projectId, payload) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.post(
                ENDPOINTS.CREATE_PAYMENT(projectId),
                payload
            );
            setPaymentData(data.data);
            return { success: true, data: data.data };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 2. CEK STATUS PEMBAYARAN ---
    const checkPaymentStatus = async (orderId) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.get(ENDPOINTS.GET_PAYMENT_STATUS(orderId));
            return { success: true, data: data.data };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 3. BUKA SNAP MIDTRANS ---
    const openSnapPayment = (snapToken, onSuccess, onPending, onError) => {
        if (!window.snap) {
            setError("Midtrans Snap belum dimuat");
            return;
        }
        window.snap.pay(snapToken, {
            onSuccess: (result) => {
                setPaymentData(null);
                onSuccess?.(result);
            },
            onPending: (result) => {
                onPending?.(result);
            },
            onError: (result) => {
                setError("Pembayaran gagal");
                onError?.(result);
            },
            onClose: () => {
                // user tutup popup tanpa bayar
            },
        });
    };

    return (
        <PaymentContext.Provider
            value={{
                loading,
                error,
                paymentData,
                clearError,
                createTransaction,
                checkPaymentStatus,
                openSnapPayment,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error("usePayment harus digunakan di dalam PaymentProvider");
    }
    return context;
};