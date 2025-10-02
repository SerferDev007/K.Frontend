import { useEffect, useState, type FormEvent, useRef } from "react";
import { Button } from "@/components/UI/Button";
import {
  getAllTenants,
  assignLoan,
  getShopsByTenant,
} from "@/services/tenantApi";
import toast from "react-hot-toast";
import { generateLoanAssignmentReceipt } from "@/services/receiptsApi"; // 👈 import your receipt function

interface LoanFormProps {
  onBack: () => void;
  token: string;
}

interface Tenant {
  _id: string;
  tenantName: string;
}

interface Shop {
  _id: string;
  shopNo: string;
  rentAmount: number;
  loans?: Array<{ isLoanActive: boolean }>;
}

const AssignLoan: React.FC<LoanFormProps> = ({ onBack, token }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [tenantShops, setTenantShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastAssigned, setLastAssigned] = useState<{
    tenantId: string;
    shopNo: string;
  } | null>(null); // store last assigned

  const formRef = useRef<HTMLFormElement>(null);

  // Fetch tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await getAllTenants();
        setAllTenants(response.tenants || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tenants");
      }
    };
    fetchTenants();
  }, []);

  // Fetch shops for selected tenant
  useEffect(() => {
    if (!selectedTenantId) {
      setTenantShops([]);
      return;
    }

    const fetchShops = async () => {
      try {
        const response = await getShopsByTenant(selectedTenantId);
        setTenantShops(response.shops || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tenant shops");
      }
    };

    fetchShops();
  }, [selectedTenantId]);

  // Form validation
  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedTenantId) newErrors.tenant = "Please select a tenant";
    if (!formData.get("shopNo")?.toString().trim())
      newErrors.shopNo = "Shop number is required";
    if (!formData.get("loanAmount")?.toString().trim())
      newErrors.loanAmount = "Loan amount is required";
    else if (isNaN(Number(formData.get("loanAmount"))))
      newErrors.loanAmount = "Loan amount must be a number";
    if (!formData.get("tenureMonths")?.toString().trim())
      newErrors.tenureMonths = "Tenure months is required";
    else if (isNaN(Number(formData.get("tenureMonths"))))
      newErrors.tenureMonths = "Tenure months must be a number";
    if (!formData.get("startDate")?.toString().trim())
      newErrors.startDate = "Loan start date is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const loanData = {
      shopNo: formData.get("shopNo")?.toString() || "",
      loanAmount: Number(formData.get("loanAmount")),
      tenureMonths: Number(formData.get("tenureMonths")),
      startDate: formData.get("startDate")?.toString() || "",
    };

    try {
      setLoading(true);
      const res = await assignLoan(selectedTenantId, loanData, token);
      console.log(`res`, res);
      if (res.success) {
        console.log(`in if block`);
        setLastAssigned({
          tenantId: selectedTenantId,
          shopNo: loanData.shopNo,
        }); // store for printing
        toast.success(res.message);
        setSelectedTenantId("");
        setTenantShops([]);
        formRef.current?.reset();
        setErrors({});
      } else {
        console.log(`in else`);
        //toast.error(res.message || "Failed to assign loan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign loan");
    } finally {
      setLoading(false);
    }
  };

  // Print loan receipt
  const handlePrintReceipt = async () => {
    if (!lastAssigned) return;
    await generateLoanAssignmentReceipt({
      tenantId: lastAssigned.tenantId,
      shopNo: lastAssigned.shopNo,
    });
  };

  return (
    <div className="flex w-full justify-center max-h-screen">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 bg-green-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl !text-yellow-500 dark:text-gray-100">
            Assign Loan to Tenant
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {/* Tenant Dropdown */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Select Tenant
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.tenant ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">-- Select Tenant --</option>
              {allTenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.tenantName}
                </option>
              ))}
            </select>
            {errors.tenant && (
              <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
            )}
          </div>

          {/* Shop Dropdown */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Select Shop
            </label>
            <select
              name="shopNo"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.shopNo ? "border-red-500" : "border-gray-200"
              }`}
              defaultValue=""
            >
              <option value="">-- Select Shop --</option>
              {tenantShops
                .filter(
                  (shop) =>
                    !shop.loans ||
                    shop.loans.every((loan) => !loan.isLoanActive)
                )
                .map((shop, index) => (
                  <option key={shop._id || index} value={shop.shopNo}>
                    {shop.shopNo}
                  </option>
                ))}
            </select>
            {errors.shopNo && (
              <p className="text-red-500 text-sm mt-1">{errors.shopNo}</p>
            )}
          </div>
        </div>

        {/* Loan Amount & Tenure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Loan Amount
            </label>
            <input
              type="number"
              name="loanAmount"
              placeholder="Enter loan amount"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.loanAmount ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.loanAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Tenure (Months)
            </label>
            <input
              type="number"
              name="tenureMonths"
              placeholder="Enter tenure in months"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.tenureMonths ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.tenureMonths && (
              <p className="text-red-500 text-sm mt-1">{errors.tenureMonths}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {/* Loan Start Date */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Loan Start Date
            </label>
            <input
              type="date"
              name="startDate"
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.startDate ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
          <Button
            type="button"
            onClick={onBack}
            className="flex-1 !rounded-xl bg-gray-700 hover:bg-gray-900 text-white"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900"
          >
            {loading ? "Processing..." : "Assign Loan"}
          </Button>
        </div>
        <div className="mt-3 text-center">
          {lastAssigned && (
            <Button
              type="button"
              onClick={handlePrintReceipt}
              className="flex-1 !rounded-xl bg-green-600 hover:bg-green-700 text-white"
            >
              Print Loan Assigned Receipt
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AssignLoan;
