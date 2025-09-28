import { useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import {
  getAllTenants,
  getShopsByTenant,
  payRent,
  payEmi,
  checkPenalties, // ✅ single API for both rent & emi
} from "@/services/tenantApi";
import toast from "react-hot-toast";
import { generateReceipt } from "@/services/reportsApi";

interface PaymentFormProps {
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

interface SubmittedPayment {
  tenantId: string;
  tenantName: string;
  shopNo: string;
  paidDate: string;
  rentAmount?: number;
  emiAmount?: number;
  penalty: number;
  details?: string;
  type: "rent" | "emi";
}

interface PenaltyDetail {
  year: number;
  month: number;
  penalty: number;
  isPaid: boolean;
  type: "rent" | "emi";
}

// Type for penalty items returned by API
interface ApiPenaltyItem {
  year: number;
  month: number;
  penalty: number | string;
  isPaid?: boolean | null;
}

interface Loan {
  emiPerMonth: number;
  startDate: Date;
  isLoanActive: boolean;
  emiPaymentHistory: {
    year: number;
    month: number;
    monthlyEmi: number;
    penalty: number;
    isEmiPaid: boolean;
    paidDate?: string;
  }[];
  totalEmiPaid?: number;
  totalPenaltyPaid?: number;
}

interface AssignedShop {
  shopNo: string;
  rentAmount: number;
  agreementDate: Date;
  rentPaymentHistory: {
    year: number;
    month: number;
    penalty: number;
    isPaid: boolean;
    paidDate?: string;
  }[];
  totalRentPaid?: number;
  totalRentPenaltyPaid?: number;
  loans?: Loan[]; // 👈 add this
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBack, token }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [assignedShops, setAssignedShops] = useState<AssignedShop[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<AssignedShop | null>(null);
  const [loading, setLoading] = useState(false);
  const [penaltyLoading, setPenaltyLoading] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [penaltyDetails, setPenaltyDetails] = useState<PenaltyDetail[]>([]);
  const [submittedPayments, setSubmittedPayments] = useState<
    SubmittedPayment[]
  >([]);
  const [payRentChecked, setPayRentChecked] = useState(false);
  const [payEmiChecked, setPayEmiChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const handleTenantDropdownClick = async () => {
    try {
      const res = await getAllTenants();
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
    if (!payRentChecked && !payEmiChecked)
      newErrors.paymentType = "Select Rent and/or EMI";
    return newErrors;
  };
  // ✅ unified checkPenalties for both rent and emi
  const checkPenaltiesBtnHandler = async () => {
    if (!selectedTenantId) {
      toast.error("Please select a tenant first.");
      return;
    }
    if (!selectedShop) {
      toast.error("Please select a shop first.");
      return;
    }
    if (!payRentChecked && !payEmiChecked) {
      toast.error("Please select Rent and/or EMI first.");
      return;
    }

    try {
      setPenaltyLoading(true);
      const res = await checkPenalties(
        selectedTenantId,
        selectedShop.shopNo,
        token
      );

      let details: PenaltyDetail[] = [];
      let totalPenalty = 0;

      if (payRentChecked && res.rentPenaltyDetails?.length) {
        const rentDetails: PenaltyDetail[] = res.rentPenaltyDetails.map(
          (d: ApiPenaltyItem) => ({
            year: d.year,
            month: d.month,
            penalty: Number(d.penalty),
            isPaid: !!d.isPaid,
            type: "rent", // 👈 added
          })
        );
        details = [...details, ...rentDetails];
        totalPenalty += res.totalRentPenalty;
      }

      if (payEmiChecked && res.emiPenaltyDetails?.length) {
        const emiDetails: PenaltyDetail[] = res.emiPenaltyDetails.map(
          (d: ApiPenaltyItem) => ({
            year: d.year,
            month: d.month,
            penalty: Number(d.penalty),
            isPaid: !!d.isPaid,
            type: "emi", // 👈 added
          })
        );
        details = [...details, ...emiDetails];
        totalPenalty += res.totalEmiPenalty;
      }

      if (details.length === 0) {
        setPenaltyAmount(0);
        setPenaltyDetails([]);
        toast.success("No penalties for this shop.");
      } else {
        setPenaltyAmount(totalPenalty);
        setPenaltyDetails(details);
        toast.success(
          `Total ${details.length} Pending Entries. Total Penalty ₹${totalPenalty.toFixed(
            2
          )}`
        );
      }
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

    const baseData = {
      tenantId: selectedTenantId,
      shopNo: selectedShop.shopNo,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      paidDate:
        formData.get("paidDate")?.toString() ||
        new Date().toISOString().split("T")[0],
      details: formData.get("details")?.toString(),
      penalty: penaltyAmount,
    };

    try {
      setLoading(true);
      const results: SubmittedPayment[] = [];

      // Rent payment
      if (payRentChecked) {
        const rentData = {
          ...baseData,
          rentAmount: selectedShop.rentAmount,
        };
        const res = await payRent(rentData, token);
        if (res.success) {
          toast.success("Rent payment successful!");
          results.push({
            ...rentData,
            tenantName,
            penalty: rentData.penalty,
            type: "rent",
          });
        } else {
          toast.error(res.message || "Failed to pay rent");
        }
      }

      // EMI payment
      if (payEmiChecked) {
        const activeLoan = selectedShop.loans?.find((l) => l.isLoanActive);
        if (!activeLoan) {
          toast.error("No active loan found for this shop");
        } else {
          const emiData = {
            ...baseData,
            emiPerMonth: activeLoan.emiPerMonth, // 👈 send EMI instead of rent
          };
          const res = await payEmi(emiData, token);
          if (res.success) {
            toast.success("EMI payment successful!");
            results.push({
              ...emiData,
              tenantName,
              penalty: emiData.penalty,
              type: "emi",
            });
          } else {
            toast.error(res.message || "Failed to pay EMI");
          }
        }
      }

      // Reset form only if all selected payments succeeded
      const allSelectedPayments = [
        ...(payRentChecked ? ["rent"] : []),
        ...(payEmiChecked ? ["emi"] : []),
      ];
      const allSucceeded =
        allSelectedPayments.length > 0 &&
        allSelectedPayments.every((t) => results.some((r) => r.type === t));

      if (allSucceeded) {
        formRef.current?.reset();
        setSelectedTenantId("");
        setSelectedShop(null);
        setAssignedShops([]);
        setErrors({});
        setPenaltyAmount(0);
        setPenaltyDetails([]);
        setPayRentChecked(false);
        setPayEmiChecked(false);
        setSubmittedPayments(results);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!submittedPayments.length) return;

    // Combine rent + EMI for same tenant/shop
    const grouped = submittedPayments.reduce(
      (acc, payment) => {
        const key = payment.tenantId + "_" + payment.shopNo;
        if (!acc[key])
          acc[key] = {
            tenantId: payment.tenantId,
            shopNo: payment.shopNo,
            isRent: false,
            isEmi: false,
          };
        if (payment.type === "rent") acc[key].isRent = true;
        if (payment.type === "emi") acc[key].isEmi = true;
        return acc;
      },
      {} as Record<
        string,
        { tenantId: string; shopNo: string; isRent: boolean; isEmi: boolean }
      >
    );

    Object.values(grouped).forEach((data) =>
      generateReceipt({
        ...data,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      })
    );
  };

  return (
    <div className="flex w-full justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-amber-400 !bg-gradient-to-br !from-gray-400 !to-gray-800 dark:bg-gray-500 text-gray-900 dark:text-gray-100 shadow-sm"
      >
        <div className="text-center">
          <h3 className="font-bold text-2xl head-text-shadow text-gray-900 dark:text-gray-100">
            Pay Rent & EMI
          </h3>
        </div>
        <div className="w-full h-px bg-gray-300 m-2 mt-3" />

        {/* Payment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={payRentChecked}
                onChange={(e) => setPayRentChecked(e.target.checked)}
              />{" "}
              Pay Rent
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={payEmiChecked}
                onChange={(e) => setPayEmiChecked(e.target.checked)}
              />{" "}
              Pay EMI
            </label>
          </div>
        </div>
        {errors.paymentType && (
          <p className="text-red-500 text-sm mt-1">{errors.paymentType}</p>
        )}

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
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 ${
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
              {assignedShops && assignedShops.length > 0 ? (
                assignedShops.map((shop) => (
                  <option key={shop.shopNo} value={shop.shopNo}>
                    {shop.shopNo}
                  </option>
                ))
              ) : (
                <option disabled>No Shops Assigned</option>
              )}
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
          <div className="flex flex-col justify-center border-2 border-red-400 rounded-lg p-2 bg-red-100 dark:bg-red-200 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {/* Rent Penalty */}
              <div className="mx-3">
                <h4 className="font-semibold mb-1 !text-red-700">
                  Rent Penalty Details:
                </h4>
                {penaltyDetails
                  .filter((d) => d.type === "rent")
                  .map((d, i) => (
                    <p
                      key={`rent-${i}`}
                      className="text-sm mb-1 text-black mx-5"
                    >
                      {d.year}-{d.month} : ₹{d.penalty.toFixed(2)}
                    </p>
                  ))}
                <p className="text-sm font-bold mt-1 bg-green-300 border-2 border-green-900 text-black px-2 py-1 rounded">
                  Total Rent Penalty: ₹
                  {penaltyDetails
                    .filter((d) => d.type === "rent")
                    .reduce((sum, d) => sum + d.penalty, 0)
                    .toFixed(2)}
                </p>
              </div>

              {/* EMI Penalty */}
              <div className="mx-3">
                <h4 className="font-semibold mb-1 !text-red-700">
                  Loan Penalty Details:
                </h4>
                {penaltyDetails
                  .filter((d) => d.type === "emi")
                  .map((d, i) => (
                    <p
                      key={`emi-${i}`}
                      className="text-sm mb-1 text-black mx-5"
                    >
                      {d.year}-{d.month} : ₹{d.penalty.toFixed(2)}
                    </p>
                  ))}
                <p className="text-sm font-bold mt-1 bg-green-300 border-2 border-green-900 text-black px-2 py-1 rounded">
                  Total EMI Penalty: ₹
                  {penaltyDetails
                    .filter((d) => d.type === "emi")
                    .reduce((sum, d) => sum + d.penalty, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
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
            {payRentChecked && selectedShop && (
              <p className="text-sm font-bold mt-1 bg-yellow-200 border-2 border-yellow-700 text-black p-1 rounded">
                Total Rent (Pending + Current): ₹
                {(() => {
                  const pendingMonths = penaltyDetails.filter(
                    (d) => d.type === "rent"
                  ).length;
                  const rent = selectedShop.rentAmount || 0;
                  return ((pendingMonths + 1) * rent).toFixed(2);
                })()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              EMI Amount
            </label>
            <input
              type="number"
              name="emiAmount"
              value={
                selectedShop?.loans?.find((loan) => loan.isLoanActive)
                  ?.emiPerMonth ?? ""
              }
              readOnly
              className="focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 bg-gray-200"
            />
            {payEmiChecked && selectedShop && (
              <p className="text-sm font-bold mt-1 bg-yellow-200 border-2 border-yellow-700 text-black p-1 rounded">
                Total EMI (Pending + Current): ₹
                {(() => {
                  const activeLoan = selectedShop.loans?.find(
                    (l) => l.isLoanActive
                  );
                  if (!activeLoan) return "0.00";
                  const pendingMonths = penaltyDetails.filter(
                    (d) => d.type === "emi"
                  ).length;
                  const emi = activeLoan.emiPerMonth || 0;
                  return ((pendingMonths + 1) * emi).toFixed(2);
                })()}
              </p>
            )}
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
            rows={1}
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
            {loading ? "Processing..." : "Submit Payment"}
          </Button>
        </div>

        {submittedPayments.length > 0 && (
          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={handlePrintReceipt}
              className="!rounded-xl bg-green-600 hover:bg-green-800 text-white"
            >
              Print Receipt(s)
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
