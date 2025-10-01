import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import { getDonationCategories } from "@/services/financeServices";
import toast from "react-hot-toast";
import { addDonation } from "@/services/financeServices";

interface DonationFormProps {
  onBack: () => void;
}

interface DonationData {
  date: string | undefined;
  category: string | undefined;
  subCategory: string | undefined;
  donorName: string | undefined;
  donorContact: string | undefined;
  amount: number;
  details: string | undefined;
}

const DonationForm: React.FC<DonationFormProps> = ({ onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showMessage = (msg: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccessMessage(msg);
      setErrorMessage("");
    } else {
      setErrorMessage(msg);
      setSuccessMessage("");
    }

    // auto-clear after 3 sec
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  // ✅ Fetch categories on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getDonationCategories();
        setAllCategories(data.categories);
        setCategories(Object.keys(data.categories));
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(
            err.message || "Error fetching Categories / Sub-Categories"
          );
        }
        throw new Error("Something went wrong");
      }
    })();
  }, []);

  // ✅ When category changes → update subCategories
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
    if (!formData.get("donorName")?.toString().trim())
      newErrors.donorName = "Donor name is required";
    const donorContact = formData.get("donorContact")?.toString().trim();
    if (!donorContact) {
      newErrors.donorContact = "Donor contact is required";
    } else if (!/^\d{10}$/.test(donorContact)) {
      newErrors.donorContact = "Donor contact must be a 10-digit number";
    }
    if (!formData.get("amount")?.toString().trim())
      newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.get("amount"))))
      newErrors.amount = "Amount must be a number";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // store form reference immediately

    const formData = new FormData(form);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const data: DonationData = {
      date: formData.get("date")?.toString(),
      category: formData.get("category")?.toString(),
      subCategory: formData.get("subCategory")?.toString(),
      donorName: formData.get("donorName")?.toString(),
      donorContact: formData.get("donorContact")?.toString(),
      amount: Number(formData.get("amount")),
      details: formData.get("details")?.toString(),
    };

    try {
      const result = await addDonation(data);
      toast.success(result.message);
      showMessage(result.message, "success");
      // ✅ use stored reference instead of e.currentTarget
      form.reset();
      setSelectedCategory("");
      setSubCategories([]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        showMessage(error.message, "error");
      }
    }
  };

  return (
    <div className="flex w-full justify-center ">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 !bg-gray-500 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Add Donation
          </h3>
          <Button
            type="button"
            onClick={onBack}
            className="!rounded-2xl text-white bg-blue-900"
          >
            Back
          </Button>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Category & SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Category
            </label>
            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 ${
                errors.category ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="" disabled hidden>
                Select Category
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
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Sub Category
            </label>
            <select
              name="subCategory"
              disabled={!selectedCategory}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 ${
                errors.subCategory ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="" disabled hidden>
                Select Sub Category
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

        {/* Donor Name & Contact */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Donor Name
            </label>
            <input
              type="text"
              name="donorName"
              placeholder="Enter donor name"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.donorName ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.donorName && (
              <p className="text-red-500 text-sm mt-1">{errors.donorName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Donor Contact
            </label>
            <input
              type="number"
              name="donorContact"
              placeholder="Enter donor contact"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.donorContact ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.donorContact && (
              <p className="text-red-500 text-sm mt-1">{errors.donorContact}</p>
            )}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.amount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          {/* Date */}
          <div>
            <label className="block text sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Date
            </label>
            <input
              type="date"
              name="date"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
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
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
            Details
          </label>
          <textarea
            name="details"
            placeholder="Enter details"
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-2 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4 gap-2">
          <Button
            type="button"
            onClick={onBack}
            className="flex-1 !rounded-xl bg-gray-700 hover:bg-gray-900 text-white"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900"
          >
            Submit Donation
          </Button>
        </div>

        {/* Messages */}
        {successMessage ||
          (errorMessage && (
            <div className="flex justify-center mt-4">
              {successMessage && (
                <p className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md text-center font-medium animate-fadeIn">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md text-center font-medium animate-fadeIn">
                  {errorMessage}
                </p>
              )}
            </div>
          ))}
      </form>
    </div>
  );
};

export default DonationForm;
