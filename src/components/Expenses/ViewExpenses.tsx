import { useEffect, useState, useMemo } from "react";
import { getAllExpenses, type Expense } from "@/services/financeServices";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entriesPerPage = 20;

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

    if (categoryFilter) {
      updated = updated.filter((e) => e.category === categoryFilter);
    }

    if (monthFilter) {
      updated = updated.filter((e) => {
        const expenseMonth = e.date.slice(0, 7); // YYYY-MM
        return expenseMonth === monthFilter;
      });
    }

    setFilteredExpenses(updated);
    setCurrentPage(1);
  }, [categoryFilter, monthFilter, expenses]);

  // ✅ Compute total expense dynamically
  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [filteredExpenses]);

  // ✅ Pagination logic
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

  if (loading) {
    return <p className="text-center mt-6">Loading expenses...</p>;
  }

  if (expenses.length === 0) {
    return <p className="text-center mt-6">No expenses found.</p>;
  }

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

      <div className="w-full overflow-x-auto border !border-gray-900 !rounded-2xl">
        <table className="w-full border-collapse border !border-gray-900 text-left table-auto">
          <thead className="text-center !bg-red-200 border !border-gray-900 dark:bg-gray-700">
            <tr>
              <th className="border-2 !border-gray-900 px-2 py-2 w-12">
                S.No.
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-18">Date</th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-30">
                Category
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-30">
                Sub-Category
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-65">
                Paid To
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-28">
                Contact
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-20">
                Amount
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-64">
                Details
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-34">Bill</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((expense, index) => (
              <tr
                key={expense._id}
                className="bg-red-50 hover:bg-red-300 transition-colors"
                style={{ height: "40px" }}
              >
                <td className="border !border-gray-900 px-2 py-2 text-center">
                  {indexOfFirstEntry + index + 1}
                </td>
                <td className="border !border-gray-900 px-2 py-2 text-center">
                  {formatDate(expense.date)}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {expense.category}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {expense.subCategory}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {expense.payeeName}
                </td>
                <td className="border text-right !border-gray-900 px-2 py-2">
                  {expense.payeeContact || "-"}
                </td>
                <td className="border  text-right !border-gray-900 px-2 py-2">
                  ₹{expense.amount}
                </td>
                <td className="border !border-gray-900 px-2 py-2 truncate max-w-[250px]">
                  {expense.details || "-"}
                </td>
                <td className="border text-center !border-gray-900 px-2 py-2 max-w-[250px] overflow-hidden">
                  {expense.billImage ? (
                    <Button className="rounded bg-amber-900 ">
                      <img
                        className="w-5 invert brightness-0"
                        src="./pics/download.svg"
                        alt="Download"
                      />
                    </Button>
                  ) : (
                    <span className="text-gray-500">No Bill Available</span>
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
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage ? "bg-red-400 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredExpenses.length === 0 && (
        <p className="text-center  text-white underline mt-6 italic font-bold">
          No expenses match the filter.
        </p>
      )}
    </div>
  );
};

export default ViewExpenses;
