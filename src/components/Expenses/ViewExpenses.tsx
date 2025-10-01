import { useEffect, useState, useMemo } from "react";
import {
  getAllExpenses,
  updateExpense,
  deleteExpense,
  type Expense,
  type ExpensePayload,
} from "@/services/financeServices";
import toast from "react-hot-toast";
import { Button } from "../UI/Button";

// Utility to format date to dd/mm/yyyy
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>(""); // YYYY-MM
  const [categories, setCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Record<string, string[]>>(
    {}
  );

  // Editing state
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Expense>>({});
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entriesPerPage = 20;

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getAllExpenses();
        setExpenses(res.expenses);
        setFilteredExpenses(res.expenses);

        // Extract unique categories for filter dropdown
        const uniqueCategories = Array.from(
          new Set(res.expenses.map((e) => e.category))
        );
        setCategories(uniqueCategories);

        // Build category → subcategory map
        const categoryMap: Record<string, string[]> = {};
        res.expenses.forEach((e) => {
          if (e.category) {
            if (!categoryMap[e.category]) categoryMap[e.category] = [];
            if (
              e.subCategory &&
              !categoryMap[e.category].includes(e.subCategory)
            )
              categoryMap[e.category].push(e.subCategory);
          }
        });
        setAllCategories(categoryMap);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter whenever filter changes
  useEffect(() => {
    let updated = [...expenses];

    if (categoryFilter)
      updated = updated.filter((e) => e.category === categoryFilter);

    if (monthFilter) {
      updated = updated.filter((e) => e.date.slice(0, 7) === monthFilter);
    }

    setFilteredExpenses(updated);
    setCurrentPage(1);
  }, [categoryFilter, monthFilter, expenses]);

  // Total expense
  const totalExpense = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [filteredExpenses]
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredExpenses.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredExpenses.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle edit click
  const handleEditClick = (expense: Expense) => {
    setEditRowId(expense._id);
    setEditFormData(expense);
    if (expense.category && allCategories[expense.category]) {
      setSubCategories(allCategories[expense.category]);
    }
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const handleChange = <K extends keyof Expense>(
    field: K,
    value: Expense[K]
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));

    if (
      field === "category" &&
      typeof value === "string" &&
      allCategories[value]
    ) {
      setSubCategories(allCategories[value]);
      setEditFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  };

  const handleSaveClick = async (id: string) => {
    try {
      // Map editFormData (Partial<Expense>) → Partial<ExpensePayload> (omit billImage:string)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { receiptImage, ...rest } = editFormData;
      const payload: Partial<ExpensePayload> = rest; // properly typed
      await updateExpense(id, payload);
      // fields align except billImage
      toast.success("Expense updated successfully");
      const res = await getAllExpenses();
      setExpenses(res.expenses);
      setFilteredExpenses(res.expenses);
      setEditRowId(null);
      setEditFormData({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expense");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      toast.success("Expense deleted successfully");
      const res = await getAllExpenses();
      setExpenses(res.expenses);
      setFilteredExpenses(res.expenses);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    }
  };

  const handleDownloadClick = (imageUrl?: string) => {
    if (!imageUrl) {
      toast.error("No receipt image available to download");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      // Extract file name from URL or fallback to "receipt.jpg"
      const fileName = imageUrl.split("/").pop() || "receipt.jpg";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download image");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading expenses...</p>;
  if (expenses.length === 0)
    return <p className="text-center mt-6">No expenses found.</p>;

  return (
    <div className="w-full p-2">
      {/* Filters */}
      <div className="flex flex-col justify-around md:flex-row gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-2 ms-2 border-gray-300 rounded-xl p-2 w-full md:w-64"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Filter by Month</label>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border-2 ms-2 border-gray-300 rounded-xl p-2 w-full md:w-64"
          />
        </div>
      </div>

      {/* Total Expense */}
      <div className="text-center mb-4 font-bold text-lg bg-red-300 w-1/4 shadow-black">
        Total Expense: ₹{totalExpense.toLocaleString()}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border !border-gray-900 !rounded-2xl">
        <table className="w-full border-collapse border !border-gray-900 text-left table-fixed">
          <thead className="text-center !bg-red-200 border !border-gray-900">
            <tr>
              <th className="border px-2 py-2 w-[4%]">Sr.No.</th>
              <th className="border px-2 py-2 w-[8%]">Date</th>
              <th className="border px-2 py-2 w-[10%]">Category</th>
              <th className="border px-2 py-2 w-[10%]">Sub-Category</th>
              <th className="border px-2 py-2 w-[21%]">Paid To</th>
              <th className="border px-2 py-2 w-[9%]">Contact</th>
              <th className="border px-2 py-2 w-[6%]">Amount</th>
              <th className="border px-2 py-2 w-[18%]">Details</th>
              <th className="border px-2 py-2 w-[4%]">Bill</th>
              <th className="border px-2 py-2 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((expense, index) => (
              <tr
                key={expense._id}
                className="bg-red-50 hover:bg-red-300 text-center"
              >
                <td className="border px-2">{indexOfFirstEntry + index + 1}</td>

                {/* Date */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <input
                      type="date"
                      value={
                        editFormData.date
                          ? new Date(editFormData.date)
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        handleChange("date", e.target.value as Expense["date"])
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    formatDate(expense.date)
                  )}
                </td>

                {/* Category */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <select
                      value={editFormData.category || ""}
                      onChange={(e) =>
                        handleChange(
                          "category",
                          e.target.value as Expense["category"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    expense.category
                  )}
                </td>

                {/* SubCategory */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <select
                      value={editFormData.subCategory || ""}
                      onChange={(e) =>
                        handleChange(
                          "subCategory",
                          e.target.value as Expense["subCategory"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    >
                      <option value="">Select</option>
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  ) : (
                    expense.subCategory
                  )}
                </td>

                {/* Paid To */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <input
                      type="text"
                      value={editFormData.payeeName || ""}
                      onChange={(e) =>
                        handleChange(
                          "payeeName",
                          e.target.value as Expense["payeeName"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    expense.payeeName
                  )}
                </td>

                {/* Contact */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <input
                      type="text"
                      value={editFormData.payeeContact || ""}
                      onChange={(e) =>
                        handleChange(
                          "payeeContact",
                          e.target.value as Expense["payeeContact"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    expense.payeeContact || "-"
                  )}
                </td>

                {/* Amount */}
                <td className="border px-2 text-right">
                  {editRowId === expense._id ? (
                    <input
                      type="number"
                      value={editFormData.amount || ""}
                      onChange={(e) =>
                        handleChange(
                          "amount",
                          Number(e.target.value) as Expense["amount"]
                        )
                      }
                      className="border rounded p-1 w-full truncate text-right"
                    />
                  ) : (
                    `₹${expense.amount}`
                  )}
                </td>

                {/* Details */}
                <td className="border px-2 truncate">
                  {editRowId === expense._id ? (
                    <input
                      type="text"
                      value={editFormData.details || ""}
                      onChange={(e) =>
                        handleChange(
                          "details",
                          e.target.value as Expense["details"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    expense.details || "-"
                  )}
                </td>

                <td className="border px-2">
                  <Button
                    onClick={() => handleDownloadClick(expense.receiptImage)}
                    className="bg-green-500 text-white rounded px-2"
                  >
                    ⬇️
                  </Button>
                </td>

                {/* Actions */}
                <td className="border px-2">
                  {editRowId === expense._id ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => handleSaveClick(expense._id)}
                        className="bg-green-500 text-white rounded px-2"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white rounded px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => handleEditClick(expense)}
                        className="bg-blue-500 text-white rounded px-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(expense._id)}
                        className="bg-red-500 text-white rounded px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-red-100 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 bg-red-100 border rounded ${
                page === currentPage ? "bg-red-400 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-red-100 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewExpenses;
