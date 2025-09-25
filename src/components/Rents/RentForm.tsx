import { useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import {
  getTenants,
  getShopsByTenant,
  payRent,
  checkPenalties,
} from "@/services/tenantApi";
import toast from "react-hot-toast";
import { generateReceipt } from "@/services/reportsApi";

interface RentFormProps {
  onBack: () => void;
  token: string; // for API calls
}

interface Tenant {
  _id: string;
  tenantName: string;
}

interface AssignedShop {
  shopNo: string;
  rentAmount: number;
}

interface PenaltyDetail {
  year: number;
  month: number;
  penalty: number;
  isPaid: boolean;
}

interface RawPenaltyDetail {
  year: number;
  month: number;
  penalty: number | string;
  isPaid?: boolean | null;
}

interface SubmittedRent {
  tenantId: string;
  tenantName: string;
  shopNo: string;
  paidDate: string;
  rentAmount: number;
  penalty: number;
  details?: string;
}

const RentForm: React.FC<RentFormProps> = ({ onBack, token }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [assignedShops, setAssignedShops] = useState<AssignedShop[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<AssignedShop | null>(null);
  const [loading, setLoading] = useState(false);
  const [penaltyLoading, setPenaltyLoading] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [penaltyDetails, setPenaltyDetails] = useState<PenaltyDetail[]>([]);
  const [submittedRent, setSubmittedRent] = useState<SubmittedRent | null>(
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  const handleTenantDropdownClick = async () => {
    try {
      const res = await getTenants();
      setAllTenants(res.tenants || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh tenants");
    }
  };

  const handleShopDropdownClick = async () => {
    if (!selectedTenantId) return;
    try {
      const res = await getShopsByTenant(selectedTenantId);
      setAssignedShops(res.shops || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh shops");
    }
  };

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedTenantId) newErrors.tenantName = "Select tenant";
    if (!formData.get("shopNo")?.toString().trim())
      newErrors.shopNo = "Select shop";
    return newErrors;
  };

  const checkPenaltiesBtnHandler = async () => {
    if (!selectedTenantId) {
      toast.error("Please select a tenant first.");
      return;
    }
    if (!selectedShop) {
      toast.error("Please select a shop first.");
      return;
    }

    try {
      setPenaltyLoading(true);
      const res = await checkPenalties(
        selectedTenantId,
        selectedShop.shopNo,
        token
      );

      if (!res) {
        toast.error("No response from server");
        return;
      }

      if (!res.hasPenalty || (res.penaltyDetails?.length || 0) === 0) {
        toast.success("No penalties for this shop.");
        setPenaltyAmount(0);
        setPenaltyDetails([]);
        return;
      }

      const details: PenaltyDetail[] = (
        res.penaltyDetails as RawPenaltyDetail[]
      ).map((d) => ({
        year: d.year,
        month: d.month,
        penalty: Number(d.penalty),
        isPaid: !!d.isPaid,
      }));

      const totalPenalty = details.reduce((s, d) => s + d.penalty, 0);

      setPenaltyAmount(totalPenalty);
      setPenaltyDetails(details);

      toast.success(
        `${details.length} pending month(s). Total penalty ₹${totalPenalty.toFixed(
          2
        )}`
      );
    } catch (err) {
      console.error("checkPenalties error:", err);
      toast.error("Failed to check penalties");
    } finally {
      setPenaltyLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!selectedShop) return toast.error("Invalid shop selected");

    const tenantName =
      allTenants.find((t) => t._id === selectedTenantId)?.tenantName || "";

    const data = {
      tenantId: selectedTenantId,
      shopNo: selectedShop.shopNo,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      paidDate:
        formData.get("paidDate")?.toString() ||
        new Date().toISOString().split("T")[0],
      rentAmount: selectedShop.rentAmount,
      details: formData.get("details")?.toString(),
      penalty: penaltyAmount,
    };

    try {
      setLoading(true);
      const res = await payRent(data, token);

      if (res.success) {
        toast.success(res.message || "Rent added successfully!");
        formRef.current?.reset();
        setSelectedTenantId("");
        setSelectedShop(null);
        setAssignedShops([]);
        setErrors({});
        setPenaltyAmount(0);
        setPenaltyDetails([]);

        // Save submitted rent for Print Receipt button
        setSubmittedRent({
          tenantId: selectedTenantId,
          tenantName,
          shopNo: data.shopNo,
          paidDate: data.paidDate,
          rentAmount: data.rentAmount,
          penalty: data.penalty,
          details: data.details,
        });
      } else {
        toast.error(res.message || "Failed to add rent");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add rent");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!submittedRent) return;

    generateReceipt({
      tenantId: submittedRent.tenantId,
      shopNo: submittedRent.shopNo,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      isRent: true,
      isEmi: false,
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
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Add Rent
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Tenant + Shop selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Select Tenant
            </label>
            <select
              value={selectedTenantId}
              onClick={handleTenantDropdownClick}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.tenantName ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">-- Select Tenant --</option>
              {allTenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.tenantName}
                </option>
              ))}
            </select>
            {errors.tenantName && (
              <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Shop Number
            </label>
            <select
              name="shopNo"
              value={selectedShop?.shopNo || ""}
              onClick={handleShopDropdownClick}
              onChange={(e) => {
                const shop =
                  assignedShops.find((s) => s.shopNo === e.target.value) ||
                  null;
                setSelectedShop(shop);
                setPenaltyAmount(0);
                setPenaltyDetails([]);
              }}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
                errors.shopNo ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">-- Select Shop --</option>
              {assignedShops.map((shop) => (
                <option key={shop.shopNo} value={shop.shopNo}>
                  {shop.shopNo}
                </option>
              ))}
            </select>
            {errors.shopNo && (
              <p className="text-red-500 text-sm mt-1">{errors.shopNo}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <Button
              type="button"
              onClick={checkPenaltiesBtnHandler}
              className="!rounded-2xl mt-2"
              disabled={penaltyLoading}
            >
              {penaltyLoading ? "Checking..." : "Check Penalties"}
            </Button>
          </div>
        </div>

        {penaltyDetails.length > 0 && (
          <div className="flex justify-center border-2 border-red-400 rounded-lg p-2 bg-red-100 dark:bg-red-200 mt-2">
            <h4 className="font-semibold mb-1 !text-red-700">
              Penalty Details:
            </h4>
            {penaltyDetails.map((d, i) => (
              <p key={i} className="text-sm mb-2 text-red-800">
                {d.year}-{d.month} : ₹{d.penalty.toFixed(2)}
                {d.isPaid ? "  (Paid)" : "  (Pending)"}
              </p>
            ))}
          </div>
        )}

        <div className="mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Penalty Amount
            </label>
            <input
              type="number"
              value={penaltyAmount}
              readOnly
              className="focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 bg-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Paid Date
            </label>
            <input
              type="date"
              name="paidDate"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              Rent Amount
            </label>
            <input
              type="number"
              name="rentAmount"
              value={selectedShop?.rentAmount || ""}
              readOnly
              className="focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 bg-gray-200"
            />
          </div>
        </div>

        <div>
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
            {loading ? "Processing..." : "Submit Rent"}
          </Button>
        </div>

        {submittedRent && (
          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={handlePrintReceipt}
              className="!rounded-xl bg-green-600 hover:bg-green-800 text-white"
            >
              Print Receipt
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RentForm;
