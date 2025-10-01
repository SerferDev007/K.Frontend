import { useEffect, useState, useMemo } from "react";
import { getAllDonations, type Donation } from "@/services/financeServices";
import toast from "react-hot-toast";

// Utility to format date to dd/mm/yyyy
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const ViewDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>(""); // format: YYYY-MM
  const [categories, setCategories] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entriesPerPage = 20;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await getAllDonations();
        setDonations(res.donations);
        setFilteredDonations(res.donations);

        // Extract unique categories for filter dropdown
        const uniqueCategories = Array.from(
          new Set(res.donations.map((d) => d.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations whenever filter changes
  useEffect(() => {
    let updated = [...donations];

    if (categoryFilter) {
      updated = updated.filter((d) => d.category === categoryFilter);
    }

    if (monthFilter) {
      updated = updated.filter((d) => {
        const donationMonth = d.date.slice(0, 7); // YYYY-MM
        return donationMonth === monthFilter;
      });
    }

    setFilteredDonations(updated);
    setCurrentPage(1); // reset page to 1 when filters change
  }, [categoryFilter, monthFilter, donations]);

  // ✅ Compute total donation dynamically
  const totalDonation = useMemo(() => {
    return filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  }, [filteredDonations]);

  // ✅ Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredDonations.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredDonations.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return <p className="text-center mt-6">Loading donations...</p>;
  }

  if (donations.length === 0) {
    return <p className="text-center mt-6">No donations found.</p>;
  }

  return (
    <div className="w-full p-2">
      {/* Filters */}
      <div className="flex flex-col justify-around md:flex-row gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Filter by Category </label>
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

      {/* Total Donation */}
      <div className="text-center mb-4 font-bold text-lg bg-amber-300 w-1/4 shadow-black">
        Total Donation: ₹{totalDonation.toLocaleString()}
      </div>

      <div className="w-full overflow-x-auto border !border-gray-900 !rounded-2xl">
        <table className="w-full border-collapse border !border-gray-900 text-left table-auto">
          <thead className="text-center !bg-amber-200 border !border-gray-900 dark:bg-gray-700">
            <tr>
              <th className="border-2 !border-gray-900 px-2 py-2 w-12">
                S.No.
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-18">Date</th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-36">
                Category
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-26">
                Sub-Category
              </th>
              <th className="border-2 !border-gray-900 px-2 py-2 w-60">
                Donor Name
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
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((donation, index) => (
              <tr
                key={donation._id}
                className="bg-amber-50 hover:bg-amber-300 transition-colors"
                style={{ height: "40px" }}
              >
                <td className="border !border-gray-900 px-2 py-2 text-center">
                  {indexOfFirstEntry + index + 1}
                </td>
                <td className="border !border-gray-900 px-2 py-2 text-center">
                  {formatDate(donation.date)}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {donation.category}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {donation.subCategory}
                </td>
                <td className="border !border-gray-900 px-2 py-2">
                  {donation.donorName}
                </td>
                <td className="border  text-right !border-gray-900 px-2 py-2">
                  {donation.donorContact}
                </td>
                <td className="border  text-right !border-gray-900 px-2 py-2">
                  ₹{donation.amount}
                </td>
                <td className="border !border-gray-900 px-2 py-2 truncate max-w-[250px]">
                  {donation.details || "-"}
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
            className="px-3 py-1 border bg-amber-100 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded bg-amber-100  ${
                page === currentPage ? "bg-amber-400 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-amber-100  border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredDonations.length === 0 && (
        <p className="text-center text-white underline mt-6 italic font-bold">
          No donations match the filter.
        </p>
      )}
    </div>
  );
};

export default ViewDonations;
