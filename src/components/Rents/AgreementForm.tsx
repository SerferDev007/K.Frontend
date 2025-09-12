import { useState, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";

interface AgreementFormProps {
  onBack: () => void;
}

interface AgreementData {
  tenantName: string | undefined;
  shopNumber: string | undefined;
  rentAmount: number | undefined;
  depositAmount: number | undefined;
  agreementStart: string | undefined;
  agreementFile?: File;
  contactNumber: string | undefined;
  email: string | undefined;
  adharNumber?: string | undefined;
}

const AgreementForm: React.FC<AgreementFormProps> = ({ onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.get("tenantName")?.toString().trim())
      newErrors.tenantName = "Tenant name is required";
    if (!formData.get("shopNumber")?.toString().trim())
      newErrors.shopNumber = "Shop number is required";
    if (!formData.get("rentAmount")?.toString().trim())
      newErrors.rentAmount = "Rent amount is required";
    else if (isNaN(Number(formData.get("rentAmount"))))
      newErrors.rentAmount = "Rent amount must be a number";
    if (!formData.get("depositAmount")?.toString().trim())
      newErrors.depositAmount = "Deposit amount is required";
    else if (isNaN(Number(formData.get("depositAmount"))))
      newErrors.depositAmount = "Deposit amount must be a number";
    if (!formData.get("agreementStart")?.toString().trim())
      newErrors.agreementStart = "Agreement start date is required";
    if (!formData.get("contactNumber")?.toString().trim())
      newErrors.contactNumber = "Contact number is required";
    if (!formData.get("email")?.toString().trim())
      newErrors.email = "Email is required";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const data: AgreementData = {
      tenantName: formData.get("tenantName")?.toString(),
      shopNumber: formData.get("shopNumber")?.toString(),
      rentAmount: Number(formData.get("rentAmount")),
      depositAmount: Number(formData.get("depositAmount")),
      agreementStart: formData.get("agreementStart")?.toString(),
      contactNumber: formData.get("contactNumber")?.toString(),
      email: formData.get("email")?.toString(),
      adharNumber: formData.get("adharNumber")?.toString(),
    };

    const agreementFile = formData.get("agreementFile") as File | null;
    if (agreementFile) data.agreementFile = agreementFile;

    console.log("Submitting agreement:", data);
  };

  return (
    <div className="flex w-full justify-center max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 bg-green-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Add Agreement
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Tenant Name & Shop Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
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
          <div>
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

        {/* Rent & Deposit */}
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
              Deposit Amount
            </label>
            <input
              type="number"
              name="depositAmount"
              placeholder="Enter deposit amount"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.depositAmount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.depositAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.depositAmount}
              </p>
            )}
          </div>
        </div>

        {/* Contact & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Contact Number
            </label>
            <input
              type="number"
              name="contactNumber"
              placeholder="Enter contact number"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.contactNumber ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Aadhaar Number
            </label>
            <input
              type="text"
              name="adharNumber"
              placeholder="Enter Aadhaar number"
              className="focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300"
            />
          </div>
          {/* Agreement Start */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Agreement Start
            </label>
            <input
              type="date"
              name="agreementStart"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.agreementStart ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.agreementStart && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agreementStart}
              </p>
            )}
          </div>
        </div>

        {/* Agreement File Upload */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
            Upload Agreement (PDF only, max 2MB)
          </label>
          <input
            type="file"
            name="agreementFile"
            accept=".pdf"
            className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 file:py-1 file:px-3 file:rounded-lg file:bg-amber-400 file:text-gray-900 hover:file:bg-orange-400"
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
            Submit Agreement
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgreementForm;
