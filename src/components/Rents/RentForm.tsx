import { useState, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";

interface RentFormProps {
  onBack: () => void;
}

const RentForm: React.FC<RentFormProps> = ({ onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.get("tenantName")?.toString().trim()) {
      newErrors.tenantName = "Tenant name is required";
    }
    if (!formData.get("shopNumber")?.toString().trim()) {
      newErrors.shopNumber = "Shop number is required";
    }
    if (!formData.get("rentAmount")?.toString().trim()) {
      newErrors.rentAmount = "Rent amount is required";
    } else if (isNaN(Number(formData.get("rentAmount")))) {
      newErrors.rentAmount = "Rent amount must be a number";
    }
    if (!formData.get("rentMonth")?.toString().trim()) {
      newErrors.rentMonth = "Rent month is required";
    }
    if (!formData.get("paymentDate")?.toString().trim()) {
      newErrors.paymentDate = "Payment date is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const data = {
      tenantName: formData.get("tenantName")?.toString(),
      shopNumber: formData.get("shopNumber")?.toString(),
      rentAmount: Number(formData.get("rentAmount")),
      rentMonth: formData.get("rentMonth")?.toString(),
      paymentDate: formData.get("paymentDate")?.toString(),
      details: formData.get("details")?.toString(),
    };

    console.log("Submitting rent:", data);
  };

  return (
    <div className="flex w-full justify-center max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 bg-green-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl head-text-shadow  text-gray-900 dark:text-gray-100">
            Add Rent
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Tenant Name & Shop Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="mt-1">
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Tenant Name
            </label>
            <input
              type="text"
              name="tenantName"
              placeholder="Enter tenant name"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.tenantName ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.tenantName && (
              <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>
            )}
          </div>

          <div className="mt-1">
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Shop Number
            </label>
            <input
              type="text"
              name="shopNumber"
              placeholder="Enter shop number"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.shopNumber ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.shopNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.shopNumber}</p>
            )}
          </div>
        </div>

        {/* Rent Amount & Rent Month */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Rent Amount
            </label>
            <input
              type="number"
              name="rentAmount"
              placeholder="Enter rent amount"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.rentAmount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.rentAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.rentAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Rent Month
            </label>
            <input
              type="month"
              name="rentMonth"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.rentMonth ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.rentMonth && (
              <p className="text-red-500 text-sm mt-1">{errors.rentMonth}</p>
            )}
          </div>
        </div>

        {/* Payment Date */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
            Payment Date
          </label>
          <input
            type="date"
            name="paymentDate"
            className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
              errors.paymentDate ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.paymentDate && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>
          )}
        </div>

        {/* Details */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
            Details
          </label>
          <textarea
            name="details"
            placeholder="Any details"
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
            className="flex-1 !rounded-xl bg-amber-400 hover:bg-orange-400 !text-gray-900"
          >
            Submit Rent
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RentForm;
