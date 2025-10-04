import { useEffect, useState, useMemo } from "react";
import {
  getAllDonations,
  type Donation,
  getDonationCategories,
  updateDonation,
  deleteDonation,
} from "@/services/financeServices";
import toast from "react-hot-toast";
import { Button } from "../UI/Button";
import { useTranslation } from "react-i18next";

// Utility to format date
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const ViewDonations = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>(""); // format: YYYY-MM
  const [categories, setCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Record<string, string[]>>(
    {}
  );

  // Editing state
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Donation>>({});
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entriesPerPage = 20;

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const res = await getAllDonations();
      setDonations(res.donations);
      setFilteredDonations(res.donations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getDonationCategories();
      setAllCategories(data.categories);
      setCategories(Object.keys(data.categories));
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchCategories();
  }, []);

  // Filter donations
  useEffect(() => {
    let updated = [...donations];
    if (categoryFilter) {
      updated = updated.filter((d) => d.category === categoryFilter);
    }
    if (monthFilter) {
      updated = updated.filter((d) => d.date.slice(0, 7) === monthFilter);
    }
    setFilteredDonations(updated);
    setCurrentPage(1);
  }, [categoryFilter, monthFilter, donations]);

  // Compute total donation
  const totalDonation = useMemo(() => {
    return filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  }, [filteredDonations]);

  // Pagination
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

  // Handle Edit Click
  const handleEditClick = (donation: Donation) => {
    setEditRowId(donation._id);
    setEditFormData(donation);
    if (donation.category && allCategories[donation.category]) {
      setSubCategories(allCategories[donation.category]);
    }
  };

  // Handle Cancel
  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  // Handle Input Change (generic)
  const handleChange = <K extends keyof Donation>(
    field: K,
    value: Donation[K]
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

  // Handle Save Update
  const handleSaveClick = async (id: string) => {
    try {
      await updateDonation(id, editFormData);
      toast.success("Donation updated successfully");
      await fetchDonations();
      setEditRowId(null);
      setEditFormData({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to update donation");
    }
  };

  // Handle Delete
  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      await deleteDonation(id);
      toast.success("Donation deleted successfully");
      await fetchDonations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete donation");
    }
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
          <label className="block mb-1 text-white font-bold">
            {" "}
            {t("filterByCategory")} :{" "}
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-2 ms-2 border-gray-300 rounded-xl p-2 w-full md:w-64"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-white font-bold">
            {t("filterByMonth")} :
          </label>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border-2 ms-2 border-gray-300 rounded-xl p-2 w-full md:w-64"
          />
        </div>
      </div>

      {/* Total Donation */}
      <div className="text-center mb-4 font-bold text-lg bg-blue-600 w-1/4 text-white shadow-black">
        {t("totalDonation")} : ₹{totalDonation.toLocaleString()}/-
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border !border-gray-900 !rounded">
        <table className="w-full border-collapse border !border-gray-900 text-left table-fixed">
          <thead className="text-center !bg-blue-100 border !border-gray-900 ">
            <tr>
              <th className="border px-2 py-2 w-[5%]">{t("srNo")}</th>
              <th className="border px-2 py-2 w-[8%]">{t("date")}</th>
              <th className="border px-2 py-2 w-[10%]">{t("category")}</th>
              <th className="border px-2 py-2 w-[10%]">{t("subCategory")}</th>
              <th className="border px-2 py-2 w-[21%]">{t("donorName")}</th>
              <th className="border px-2 py-2 w-[9%]">{t("contact")}</th>
              <th className="border px-2 py-2 w-[7%]">{t("amount")}</th>
              <th className="border px-2 py-2 w-[18%]">{t("details")}</th>
              <th className="border px-2 py-2 w-[12%]">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((donation, index) => (
              <tr
                key={donation._id}
                className="bg-blue-50 hover:bg-gray-300 text-center"
              >
                {/* Sr.No */}
                <td className="border px-2 w-[5%]">
                  {indexOfFirstEntry + index + 1}
                </td>

                {/* Date */}
                <td className="border px-2 w-[10%]">
                  {editRowId === donation._id ? (
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
                        handleChange("date", e.target.value as Donation["date"])
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    formatDate(donation.date)
                  )}
                </td>

                {/* Category */}
                <td className="border px-2 w-[12%]">
                  {editRowId === donation._id ? (
                    <select
                      value={editFormData.category || ""}
                      onChange={(e) =>
                        handleChange(
                          "category",
                          e.target.value as Donation["category"]
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
                    donation.category
                  )}
                </td>

                {/* SubCategory */}
                <td className="border px-2 w-[12%]">
                  {editRowId === donation._id ? (
                    <select
                      value={editFormData.subCategory || ""}
                      onChange={(e) =>
                        handleChange(
                          "subCategory",
                          e.target.value as Donation["subCategory"]
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
                    donation.subCategory
                  )}
                </td>

                {/* Donor Name */}
                <td className="border px-2 w-[20%]">
                  {editRowId === donation._id ? (
                    <input
                      type="text"
                      value={editFormData.donorName || ""}
                      onChange={(e) =>
                        handleChange(
                          "donorName",
                          e.target.value as Donation["donorName"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    donation.donorName
                  )}
                </td>

                {/* Contact */}
                <td className="border px-2 w-[10%]">
                  {editRowId === donation._id ? (
                    <input
                      type="text"
                      value={editFormData.donorContact || ""}
                      onChange={(e) =>
                        handleChange(
                          "donorContact",
                          e.target.value as Donation["donorContact"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    donation.donorContact
                  )}
                </td>

                {/* Amount */}
                <td className="border px-2 w-[8%] text-right">
                  {editRowId === donation._id ? (
                    <input
                      type="number"
                      value={editFormData.amount || ""}
                      onChange={(e) =>
                        handleChange(
                          "amount",
                          Number(e.target.value) as Donation["amount"]
                        )
                      }
                      className="border rounded p-1 w-full truncate text-right"
                    />
                  ) : (
                    `₹${donation.amount}`
                  )}
                </td>

                {/* Details */}
                <td className="border px-2 w-[15%] truncate">
                  {editRowId === donation._id ? (
                    <input
                      type="text"
                      value={editFormData.details || ""}
                      onChange={(e) =>
                        handleChange(
                          "details",
                          e.target.value as Donation["details"]
                        )
                      }
                      className="border rounded p-1 w-full truncate"
                    />
                  ) : (
                    donation.details || "-"
                  )}
                </td>

                {/* Actions */}
                <td className="border px-2 w-[8%]">
                  {editRowId === donation._id ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => handleSaveClick(donation._id)}
                        className="bg-green-500 text-white rounded px-2"
                      >
                        {t("save")}
                      </Button>
                      <Button
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white rounded px-2"
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => handleEditClick(donation)}
                        className="bg-blue-500 text-white rounded px-2"
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(donation._id)}
                        className="bg-red-500 text-white rounded px-2"
                      >
                        {t("delete")}
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
            className="px-3 py-1 border bg-blue-100 rounded disabled:opacity-50"
          >
            {t("prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded bg-blue-100 ${
                page === currentPage ? "bg-blue-400 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-100 border rounded disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewDonations;
