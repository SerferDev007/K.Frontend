import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";

interface DonationFormData {
  donationNo: string;
  date: string;
  category: string;
  subCategory: string;
  donorName: string;
  donorContact: string;
  amount: number | "";
  details: string;
}

interface DonationFormProps {
  onBack: () => void;
  categories: string[]; // from backend
  subCategories: string[]; // from backend
}

const DonationForm: React.FC<DonationFormProps> = ({
  onBack,
  categories,
  subCategories,
}) => {
  const [formData, setFormData] = useState<DonationFormData>({
    donationNo: "",
    date: "",
    category: "",
    subCategory: "",
    donorName: "",
    donorContact: "",
    amount: "",
    details: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting donation:", formData);
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-6 rounded-lg border-4 border-amber-400
                   bg-white dark:bg-neutral-900
                   text-gray-900 dark:text-gray-100
                   shadow-sm"
      >
        <div className="text-center">
          <h3 className="dark:text-white font-bold text-2xl head-text-shadow head-text-stroke">
            Add Donation
          </h3>
        </div>

        <div className="w-full h-px bg-gray-300 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Donation Number */}
          <div className="mt-2">
            <label
              htmlFor="donationNo"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Donation Number
            </label>
            <input
              type="text"
              id="donationNo"
              name="donationNo"
              value={formData.donationNo} // comes directly from backend
              placeholder={formData.donationNo}
              readOnly
              disabled
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                 placeholder-gray-500 dark:placeholder-gray-400
                 !text-black dark:text-white bg-transparent w-full px-3 py-2
                 [appearance:textfield] cursor-pointer"
            />
          </div>

          {/* Date */}
          <div className="mt-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                 placeholder-gray-500 dark:placeholder-gray-400
                 !text-black dark:text-white bg-transparent w-full px-3 py-2
                 [appearance:textfield] cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                          text-black dark:text-white bg-transparent w-full px-3 py-2 cursor-pointer"
              required
            >
              <option value="" disabled hidden>
                Select Category
              </option>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="subCategory"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Sub Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                         text-black dark:text-white bg-transparent w-full px-3 py-2 cursor-pointer"
              required
            >
              <option value="" disabled hidden>
                Select Sub Category
              </option>
              {subCategories && subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No sub-categories available
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Donor Name */}
        <div className="mt-2">
          <label
            htmlFor="donorName"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Donor Name
          </label>
          <input
            type="text"
            id="donorName"
            name="donorName"
            value={formData.donorName}
            onChange={handleChange}
            placeholder="Enter donor name"
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent w-full px-3 py-2 cursor-pointer"
            required
          />
        </div>

        {/* Donor Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mt-2">
            <label
              htmlFor="donorContact"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Donor Contact
            </label>
            <input
              type="number"
              id="donorContact"
              name="donorContact"
              value={formData.donorContact}
              onChange={handleChange}
              onWheel={(e) => e.currentTarget.blur()} // disable scroll change
              placeholder="Enter contact number"
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                 placeholder-gray-500 dark:placeholder-gray-400
                 !text-black dark:text-white bg-transparent w-full px-3 py-2
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-pointer"
              required
            />
          </div>

          {/* Amount */}
          <div className="mt-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Donation Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onWheel={(e) => e.currentTarget.blur()} // disable scroll change
              placeholder="Enter contact number"
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                 placeholder-gray-500 dark:placeholder-gray-400
                 !text-black dark:text-white bg-transparent w-full px-3 py-2
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-2">
          <label
            htmlFor="details"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Details
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Any details"
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent w-full px-3 py-2 resize-none cursor-pointer"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            type="button"
            onClick={onBack}
            className="flex-1 !rounded-xl bg-gray-500 hover:bg-gray-600 text-white"
          >
            Back to Donations
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
