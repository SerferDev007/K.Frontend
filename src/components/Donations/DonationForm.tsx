import { useState, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";

interface DonationFormProps {
  onBack: () => void;
  categories: string[];
  subCategories: string[];
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

const DonationForm: React.FC<DonationFormProps> = ({
  onBack,
  categories,
  subCategories,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (!formData.get("donorContact")?.toString().trim())
      newErrors.donorContact = "Donor contact is required";
    if (!formData.get("amount")?.toString().trim())
      newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.get("amount"))))
      newErrors.amount = "Amount must be a number";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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

    console.log("Submitting donation:", data);
  };

  return (
    <div className="flex w-full justify-center max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 bg-green-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Add Donation
          </h3>
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
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
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
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
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
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
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
      </form>
    </div>
  );
};

export default DonationForm;
