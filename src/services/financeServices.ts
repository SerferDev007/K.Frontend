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

export type ApiMessageResponse = { message: string };

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
    const errMsg =
      (result as ApiMessageResponse).message || "Failed to add donation";
    throw new Error(errMsg);
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
    throw new Error(
      (data as ApiMessageResponse).message || "Failed to fetch donations"
    );
  }

  return data as GetDonationsResponse;
};

// Update donation
export const updateDonation = async (
  id: string,
  data: Partial<DonationPayload>
): Promise<AddDonationResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/donation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = (await res.json()) as
      | AddDonationResponse
      | ApiMessageResponse;

    if (!res.ok) {
      const errMsg =
        (result as ApiMessageResponse).message || "Failed to update donation";
      throw new Error(errMsg);
    }
    return result as AddDonationResponse;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update donation";
    toast.error(message);
    throw new Error(message);
  }
};

// Delete donation
export const deleteDonation = async (
  id: string
): Promise<ApiMessageResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/donation/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = (await res.json()) as ApiMessageResponse;
    if (!res.ok) {
      throw new Error(result.message || "Failed to delete donation");
    }
    return result;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete donation";
    toast.error(message);
    throw new Error(message);
  }
};

//
//
//

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
      const res = await fetch(`${BASE_URL}/api/expense/categories`, {
        method: "GET",
        credentials: "include",
      });
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
  } else {
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_URL}/api/expense`, {
    method: "POST",
    headers,
    body,
    credentials: "include", // ✅ required for cookies
  });

  const result = await res.json();

  if (!res.ok)
    throw new Error(
      (result as ApiMessageResponse).message || "Failed to add expense"
    );

  return result as AddExpenseResponse;
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
    throw new Error(
      (data as ApiMessageResponse).message || "Failed to fetch expenses"
    );
  }

  return data as GetExpensesResponse;
};

// Update expense
export const updateExpense = async (
  id: string,
  data: Partial<ExpensePayload>
): Promise<AddExpenseResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/expense/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = (await res.json()) as
      | AddExpenseResponse
      | ApiMessageResponse;
    if (!res.ok) {
      const errMsg =
        (result as ApiMessageResponse).message || "Failed to update expense";
      throw new Error(errMsg);
    }
    return result as AddExpenseResponse;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update expense";
    toast.error(message);
    throw new Error(message);
  }
};

// Delete expense
export const deleteExpense = async (
  id: string
): Promise<ApiMessageResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/expense/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = (await res.json()) as ApiMessageResponse;

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete expense");
    }
    return result;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete expense";
    toast.error(message);
    throw new Error(message);
  }
};
