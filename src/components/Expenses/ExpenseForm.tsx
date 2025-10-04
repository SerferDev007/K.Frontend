import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import { getExpenseCategories, addExpense } from "@/services/financeServices";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ExpenseFormProps {
  onBack: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ Fetch categories on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getExpenseCategories();
        setAllCategories(data.categories);
        setCategories(Object.keys(data.categories));
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(
            err.message || "Error fetching Categories / Sub-Categories"
          );
        }
      }
    })();
  }, []);

  // ✅ Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory && allCategories[selectedCategory]) {
      setSubCategories(allCategories[selectedCategory]);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, allCategories]);

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.get("date")?.toString().trim())
      newErrors.date = "Date is required";
    if (!formData.get("category")?.toString().trim())
      newErrors.category = "Category is required";
    if (!formData.get("subCategory")?.toString().trim())
      newErrors.subCategory = "Sub-category is required";
    if (!formData.get("payeeName")?.toString().trim())
      newErrors.payeeName = "Payee name is required";
    if (!formData.get("payeeContact")?.toString().trim())
      newErrors.payeeContact = "Payee contact is required";
    if (!formData.get("amount")?.toString().trim())
      newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.get("amount"))))
      newErrors.amount = "Amount must be a number";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Build a properly typed payload after validation of required fields
    const payload = {
      date: formData.get("date")?.toString(),
      category: formData.get("category")?.toString(),
      subCategory: formData.get("subCategory")?.toString(),
      payeeName: formData.get("payeeName")?.toString(),
      payeeContact: formData.get("payeeContact")?.toString(),
      amount: Number(formData.get("amount")),
      details: formData.get("details")?.toString(),
    } as const;

    // Optional file
    const billImage = formData.get("billImage") as File | null;

    try {
      const result = await addExpense(
        billImage ? { ...payload, billImage } : { ...payload }
      );
      toast.success(result.message);
      setSuccessMessage(result.message || "Expense added successfully");
      setErrorMessage(null);

      // hide after 3s
      setTimeout(() => setSuccessMessage(null), 3000);
      form.reset();
      setSelectedCategory("");
      setSubCategories([]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        setErrorMessage(error.message || "Failed to add expense");
        setSuccessMessage(null);

        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  return (
    <div className="flex w-full justify-center">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-blue-600 !bg-gray-100 dark:bg-gray-500 !text-black dark:text-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-2xl text-black dark:text-gray-100">
            {t("addExpense")}
          </h3>
          <Button
            type="button"
            onClick={onBack}
            className="!rounded-2xl text-white bg-blue-900"
          >
            {t("back")}
          </Button>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Category & SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("category")}
            </label>
            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer ${
                errors.category ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="" disabled hidden>
                {t("selectCategory")}
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("subCategory")}
            </label>
            <select
              name="subCategory"
              disabled={!selectedCategory}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer ${
                errors.subCategory ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="" disabled>
                {t("subCategory")} {t("select")}
              </option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>
            )}
          </div>
        </div>

        {/* Payee Name & Contact */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("payeeName")}
            </label>
            <input
              type="text"
              name="payeeName"
              placeholder={`${t("payeeName")} ${t("enter")}`}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 ${
                errors.payeeName ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.payeeName && (
              <p className="text-red-500 text-sm mt-1">{errors.payeeName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("contact")}
            </label>
            <input
              type="number"
              name="payeeContact"
              placeholder={`${t("contact")} ${t("enter")}`}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 ${
                errors.payeeContact ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.payeeContact && (
              <p className="text-red-500 text-sm mt-1">{errors.payeeContact}</p>
            )}
          </div>
        </div>

        {/* Amount & Date */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("amount")}
            </label>
            <input
              type="number"
              name="amount"
              placeholder={`${t("amount")} ${t("enter")}`}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 ${
                errors.amount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("date")}
            </label>
            <input
              type="date"
              name="date"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">
            {t("details")}
          </label>
          <textarea
            name="details"
            placeholder={`${t("details")} ${t("enter")}`}
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-2 resize-none"
            rows={3}
          />
        </div>

        {/* Receipt Upload */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">
            {t("uploadBill")} (1MB)
          </label>
          <input
            type="file"
            name="billImage"
            accept="image/*,.pdf"
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-2 cursor-pointer file:py-1 file:px-3 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4 gap-2">
          <Button
            type="button"
            onClick={onBack}
            className="flex-1 !rounded-xl bg-gray-700 hover:bg-gray-900 text-white"
          >
            {t("back")}
          </Button>
          <Button
            type="submit"
            className="flex-1 !rounded-xl bg-blue-600 hover:bg-blue-400 text-white"
          >
            {t("submitExpense")}
          </Button>
        </div>
        {/* Messages */}
        {successMessage ||
          (errorMessage && (
            <div className="flex justify-center mt-4">
              {successMessage && (
                <p className="!bg-green-100 !text-green-800 px-4 py-2 rounded-lg shadow-md text-center font-medium animate-fadeIn">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="!bg-red-100 !text-red-800 px-4 py-2 rounded-lg shadow-md text-center font-medium animate-fadeIn">
                  {errorMessage}
                </p>
              )}
            </div>
          ))}
      </form>
    </div>
  );
};

export default ExpenseForm;
