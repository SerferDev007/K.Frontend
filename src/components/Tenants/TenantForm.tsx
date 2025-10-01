import { useState, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import { toast } from "react-hot-toast";
import { createTenant } from "@/services/tenantApi";
import { useNavigate } from "react-router-dom";

interface TenantFormProps {
  onBack: () => void;
}

interface TenantData {
  tenantName: string | undefined;
  tenantPhoto?: File;
  contactNumber: string | undefined;
  adharNumber?: string | undefined;
}

const TenantForm: React.FC<TenantFormProps> = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.get("tenantName")?.toString().trim())
      newErrors.tenantName = "Tenant name is required";
    if (!formData.get("contactNumber")?.toString().trim())
      newErrors.contactNumber = "Contact number is required";
    if (!formData.get("adharNumber")?.toString().trim())
      newErrors.adharNumber = "Adhar Number is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const data: TenantData = {
      tenantName: formData.get("tenantName")?.toString(),
      contactNumber: formData.get("contactNumber")?.toString(),
      adharNumber: formData.get("adharNumber")?.toString(),
    };

    const tenantPhoto = formData.get("tenantPhoto") as File | null;
    if (tenantPhoto) data.tenantPhoto = tenantPhoto;

    try {
      setLoading(true);
      let newTenantId = tenantId;

      if (!tenantId) {
        const tenantResult = await createTenant({
          tenantName: data.tenantName!,
          mobileNo: data.contactNumber!,
          adharNo: data.adharNumber,
        });

        if (!tenantResult.tenant?._id) {
          toast.error(tenantResult.message || "Failed to create tenant");
          return;
        }

        toast.success("Tenant created successfully!");
        newTenantId = tenantResult.tenant._id;
        setTenantId(newTenantId);

        form.reset();
        setErrors({});
        setTenantId("");
      }
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Error submitting tenant";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const backBtnHandler = () => {
    navigate(`/tenants`);
  };

  return (
    <div className="flex w-full justify-center max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 bg-green-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Add Tenant
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Tenant Name & Contact */}
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
        </div>

        {/* Aadhaar & Photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
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
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Upload Photo
            </label>
            <input
              type="file"
              name="tenantPhoto"
              accept="image/*"
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-1 cursor-pointer text-gray-900 dark:text-gray-100 file:py-1 file:px-3 file:rounded-lg file:bg-blue-400 file:text-white hover:file:bg-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4 gap-2">
          <Button
            type="button"
            onClick={backBtnHandler}
            className="flex-1 !rounded-xl bg-gray-700 hover:bg-gray-900 text-white"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900"
          >
            {loading ? "Processing..." : "Submit Tenant"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TenantForm;
