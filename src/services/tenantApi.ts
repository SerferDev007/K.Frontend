// src/api/tenantApi.ts
interface TenantData {
  tenantName: string;
  mobileNo: string;
  adharNo?: string;
}

interface ShopData {
  shopNo: string;
  rentAmount: number;
  depositAmount: number;
  agreementStart: string;
}

import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ---------------- Tenant APIs ----------------

// Get all tenants
export const getTenants = async () => {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) toast.error("Failed to fetch tenants");
  return res.json();
};

// Get single tenant details
export const getTenantDetails = async (tenantId: string) => {
  const res = await fetch(`${BASE_URL}/details/${tenantId}`);
  if (!res.ok) toast.error("Failed to fetch tenant details");
  return res.json();
};

// tenantApi.ts
export const createTenant = async (tenantData: TenantData) => {
  const res = await fetch(`${BASE_URL}/api/tenant/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tenantData),
    credentials: "include", // ✅ Important: sends cookies along with request
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create tenant");
  }

  return res.json();
};

// Assign a shop to a tenant
export const assignShop = async (
  tenantId: string,
  shopData: ShopData,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/assign-shop/${tenantId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shopData),
  });
  if (!res.ok) toast.error("Failed to assign shop");
  return res.json();
};

// Pay rent
export const payRent = async (
  tenantId: string,
  token: string,
  amount: number
) => {
  const res = await fetch(`${BASE_URL}/pay-rent/${tenantId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) toast.error("Failed to pay rent");
  return res.json();
};

// Mark rent/loan/lump sum as paid
export const markAsPaid = async (tenantId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/mark-paid/${tenantId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) toast.error("Failed to mark as paid");
  return res.json();
};

// Check penalties for a shop
export const checkPenalties = async (
  tenantId: string,
  shopNo: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/${tenantId}/shops/${shopNo}/penalties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) toast.error("Failed to fetch penalties");
  return res.json();
};

// Clear all pending payments
export const clearAllPending = async (tenantId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/clear-all-pending/${tenantId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) toast.error("Failed to clear pending payments");
  return res.json();
};
