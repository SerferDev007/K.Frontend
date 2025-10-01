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

// ✅ Expense Category response
export type ExpenseCategoriesResponse = {
  categories: Record<string, string[]>;
};

// ✅ Payload for adding expense
export type ExpensePayload = {
  date?: string;
  category: string;
  subCategory: string;
  payeeName: string;
  payeeContact?: string;
  amount: number;
  details?: string;
  billImage?: File; // optional receipt upload
};

// ✅ API Response for adding expense
export type AddExpenseResponse = {
  message: string;
  expense?: unknown;
};

// ✅ Expense type
export type Expense = {
  _id: string;
  date: string;
  category: string;
  subCategory: string;
  payeeName: string;
  payeeContact?: string;
  amount: number;
  details?: string;
  billImage?: string;
};

// ✅ Get All Expenses Response
export type GetExpensesResponse = {
  expenses: Expense[];
};

// ────────────────────────────────
// 📌 Get Expense Categories
// ────────────────────────────────
export const getExpenseCategories =
  async (): Promise<ExpenseCategoriesResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/api/expense/categories`);
      if (!res.ok) throw new Error("Failed to fetch expense categories");
      return (await res.json()) as ExpenseCategoriesResponse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
      throw new Error("Something went wrong");
    }
  };

// ────────────────────────────────
// 📌 Add Expense (with optional receipt upload)
// ────────────────────────────────
export const addExpense = async (
  data: ExpensePayload
): Promise<AddExpenseResponse> => {
  let body: BodyInit;
  let headers: HeadersInit | undefined;

  if (data.billImage) {
    // If file is attached → use FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "billImage" && value instanceof File) {
          formData.append("billImage", value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    body = formData;
    headers = undefined; // browser sets multipart headers automatically
  } else {
    // Else → JSON
    headers = {
      "Content-Type": "application/json",
    };
    body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_URL}/api/expense`, {
    method: "POST",
    headers,
    body,
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to add expense");
  }

  return result; // { message, expense }
};

// ────────────────────────────────
// 📌 Get All Expenses
// ────────────────────────────────
export const getAllExpenses = async (): Promise<GetExpensesResponse> => {
  const res = await fetch(`${BASE_URL}/api/expense`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch expenses");
  }

  return data;
};
