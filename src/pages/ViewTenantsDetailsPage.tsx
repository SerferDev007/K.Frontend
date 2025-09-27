import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/services/tenantApi";
import toast from "react-hot-toast";

interface Loan {
  emiPerMonth: number;
  loanAmount: number;
  isLoanActive: boolean;
  emiPaymentHistory: {
    year: number;
    month: number;
    isEmiPaid: boolean;
    paidDate?: string;
  }[];
}

interface RentPaymentHistory {
  year: number;
  month: number;
  isPaid: boolean;
  paidDate?: string;
}

interface AssignedShop {
  shopNo: string;
  rentAmount: number;
  agreementDate: Date;
  rentPaymentHistory: RentPaymentHistory[];
  loans?: Loan[];
}

interface Tenant {
  _id: string;
  tenantName: string;
  mobileNo: number;
  adharNo: number;
  shopsAllotted: AssignedShop[];
}

const ViewTenantsDetailsPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      if (!tenantId) return;
      try {
        const res = await getTenantDetails(tenantId);
        setTenant(res.tenant);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tenant details");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!tenant) return <p className="text-center mt-6">Tenant not found</p>;

  return (
    <div className="mt-15 flex flex-col items-center w-full max-w-6xl mx-auto p-6">
      {/* Tenant Info Card */}
      <div className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-amber-600 mb-4">
          {tenant.tenantName}
        </h2>
        <div className="flex flex-wrap gap-6 text-lg !text-gray-900 dark:text-gray-200">
          <p>
            📱 <span className="font-semibold">Mobile:</span> {tenant.mobileNo}
          </p>
          <p>
            🆔 <span className="font-semibold">Adhar:</span> {tenant.adharNo}
          </p>
        </div>
      </div>

      {/* Shops Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {tenant.shopsAllotted.map((shop) => (
          <div
            key={shop.shopNo}
            className="bg-gradient-to-br !from-green-200 !to-green-400 dark:from-gray-700 dark:to-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg p-3"
          >
            <div className="flex">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                🏬 Shop No: {shop.shopNo}
              </h3>
              <p className="text-lg ms-5 m-2">
                <span className="font-semibold">Agreement Date:</span>{" "}
                {shop.agreementDate
                  ? new Date(shop.agreementDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <p className="text-lg mb-2">
              💰 <span className="font-semibold">Rent Amount:</span> ₹
              {shop.rentAmount}
            </p>
            <p className="mb-4">
              📅 <span className="font-semibold">Previous Rent:</span>{" "}
              {shop.rentPaymentHistory[0]?.isPaid ? "✅ Paid" : "❌ Unpaid"}
            </p>

            {/* Loans */}
            {shop.loans?.length ? (
              <div className="!bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="font-bold underline">📌 Loans</p>
                {shop.loans.map((loan, i) => (
                  <p
                    key={i}
                    className="flex justify-between text-sm md:text-base"
                  >
                    <p className="flex flex-col justify-between text-sm ">
                      <span>Loan Amount: ₹{loan.loanAmount}</span>
                      <span>EMI: ₹{loan.emiPerMonth}</span>
                    </p>
                    <span
                      className={
                        loan.isLoanActive ? "text-green-700" : "text-red-600"
                      }
                    >
                      {loan.isLoanActive ? "Active" : "Closed"}
                    </span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="italic underline text-black dark:text-gray-300">
                No loans assigned
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTenantsDetailsPage;
