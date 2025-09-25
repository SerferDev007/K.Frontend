// src/api/tenantApi.ts
interface TenantData {
  tenantName: string;
  mobileNo: string;
  adharNo?: string;
}

interface ShopData {
  shopNo: string;
  rentAmount: number;
  deposit: number;
  agreementDate: string;
}

interface RentData {
  tenantId: string;
  shopNo: string;
  year: number;
  month: number;
  paidDate: string;
  rentAmount: number;
  details?: string;
}

interface PenaltyDetail {
  year: number;
  month: number;
  penalty: number;
  isPaid?: boolean;
}

interface CheckPenaltiesResponse {
  shopNo: string;
  hasPenalty: boolean;
  penaltyDetails: PenaltyDetail[];
}

import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ---------------- Tenant APIs ----------------

// Get all tenants
export const getTenants = async () => {
  const res = await fetch(`${BASE_URL}/api/tenant`);
  if (!res.ok) toast.error("Failed to fetch tenants");
  return res.json();
};

// Get single tenant details
export const getTenantDetails = async (tenantId: string) => {
  const res = await fetch(`${BASE_URL}/api/tenant/details/${tenantId}`);
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
  const res = await fetch(`${BASE_URL}/api/tenant/assign-shop/${tenantId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shopData),
    credentials: "include",
  });
  if (!res.ok) toast.error("Failed to assign shop");
  return await res.json();
};

//get available shops
export const getAvailableShops = async () => {
  const res = await fetch(`${BASE_URL}/api/shop/available`);
  if (!res.ok) toast.error("Failed to fetch available shops");
  return await res.json();
};

export const getShopsByTenant = async (tenantId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/shop/tenants-with-shop/${tenantId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!res.ok) {
    toast.error("Failed to fetch available shops");
    return { shops: [] };
  }
  return await res.json();
};

// Pay rent
export const payRent = async (data: RentData, token: string) => {
  const res = await fetch(`${BASE_URL}/api/tenant/pay-rent/${data.tenantId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // 👈 send raw data
    credentials: "include",
  });

  if (!res.ok) {
    const errMsg = (await res.json())?.message || "Failed to pay rent";
    toast.error(errMsg);
    return { success: false, message: errMsg };
  }

  return res.json(); // should be { success, message, rent }
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
  token?: string
): Promise<CheckPenaltiesResponse> => {
  // correct backend route — update if your backend route differs
  const url = `${BASE_URL}/api/tenant/${tenantId}/shops/${shopNo}/penalties`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include", // include cookies/session if needed
  });

  if (!res.ok) {
    // try to parse backend message
    const body = await res.json().catch(() => null);
    const errMsg =
      body?.message || res.statusText || "Failed to fetch penalties";
    toast.error(errMsg);
    throw new Error(errMsg);
  }

  return (await res.json()) as CheckPenaltiesResponse;
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
