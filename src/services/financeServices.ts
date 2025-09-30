import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

type DonationCategoriesResponse = {
  categories: Record<string, string[]>;
};

// ✅ Keep it pure (no toast, no reset here)
export type DonationPayload = {
  date?: string;
  category?: string;
  subCategory?: string;
  donorName?: string;
  donorContact?: string;
  amount: number;
  details?: string;
};

export type AddDonationResponse = {
  message: string;
  donation?: unknown;
};

export type Donation = {
  _id: string;
  date: string;
  category: string;
  subCategory: string;
  donorName: string;
  donorContact: string;
  amount: number;
  details?: string;
};

export type GetDonationsResponse = {
  donations: Donation[];
};

export const getDonationCategories =
  async (): Promise<DonationCategoriesResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/api/donation/categories`);
      if (!res.ok) throw new Error("Failed to fetch donation categories");
      const data = (await res.json()) as DonationCategoriesResponse;
      return data; // { categories: { Vargani: [...], Denagi: [...], ... } }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
      throw new Error("Something went wrong");
    }
  };

export const addDonation = async (
  data: DonationPayload
): Promise<AddDonationResponse> => {
  const res = await fetch(`${BASE_URL}/api/donation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json(); // read once

  if (!res.ok) {
    throw new Error(result.message || "Failed to add donation");
  }

  return result; // { message, donation }
};

export const getAllDonations = async (): Promise<GetDonationsResponse> => {
  const res = await fetch(`${BASE_URL}/api/donation`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch donations");
  }

  return data;
};
