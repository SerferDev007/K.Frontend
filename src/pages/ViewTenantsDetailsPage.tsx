import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/services/tenantApi";
import toast from "react-hot-toast";
import { Button } from "@/components/UI/Button";
import { useAuth } from "@/hooks/useAuth";

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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  if (authLoading) {
    return <div className="text-white">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!tenant) return <p className="text-center mt-6">Tenant not found</p>;

  const goBackBtnHandler = () => {
    navigate(`/tenants`);
  };

  return (
    <div className="flex flex-col items-start justify-center p-5 max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg px-5">
      {/* Tenant Info Card */}
      <div className="w-full flex justify-between bg-blue-300 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md ps-4 pt-2 mb-4">
        <div>
          <h2 className="!text-4xl font-bold text-blue-600 mb-2">
            {tenant.tenantName}
          </h2>
          <div className="flex flex-wrap gap-6 text-lg !text-gray-900 dark:text-gray-200">
            <p>
              📱 <span className="font-semibold">Mobile:</span>{" "}
              {tenant.mobileNo}
            </p>
            <p>
              🆔 <span className="font-semibold">Adhar:</span> {tenant.adharNo}
            </p>
          </div>
        </div>
        <Button
          className="my-3 mx-3 !rounded-2xl text-white bg-blue-900"
          onClick={goBackBtnHandler}
        >
          {" "}
          ⬅️ Go Back
        </Button>
      </div>

      {/* Shops Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {tenant.shopsAllotted.map((shop) => (
          <div
            key={shop.shopNo}
            className="bg-gradient-to-br !from-blue-100 !to-blue-200  border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-4"
          >
            {/* Shop Header */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                🏬 Shop No: {shop.shopNo}
              </h3>
              <p className="text-sm !text-gray-900 dark:text-gray-300">
                Agreement:{" "}
                {shop.agreementDate
                  ? new Date(shop.agreementDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            {/* Rent Info */}
            <p className="text-md mb-1 !text-gray-800 dark:text-gray-200">
              💰 Rent Amount: ₹{shop.rentAmount}
            </p>

            {/* Last 5 Rent Payments Table */}
            <div className="mb-2">
              <p className="font-semibold !text-gray-700 dark:text-gray-300 mb-1">
                🧾 Last 5 Rent Payments:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border border-gray-300">
                  <thead className="!bg-gray-300">
                    <tr>
                      <th className="px-3 py-1 border-b border-gray-300">
                        Month/Year
                      </th>
                      <th className="px-3 py-1 border-b border-gray-300">
                        Status
                      </th>
                      <th className="px-3 py-1 border-b border-gray-300">
                        Paid Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shop.rentPaymentHistory.slice(-5).map((payment, idx) => (
                      <tr key={idx} className="bg-gray-50">
                        <td className="px-3 py-1 border-b border-gray-300">
                          {`${String(payment.month).padStart(2, "0")}/${payment.year}`}
                        </td>
                        <td className="px-3 py-1 border-b border-gray-300">
                          {payment.isPaid ? "✅ Paid" : "❌ Unpaid"}
                        </td>
                        <td className="px-3 py-1 border-b border-gray-300">
                          {payment.paidDate
                            ? new Date(payment.paidDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loans */}
            {shop.loans?.length ? (
              <div>
                <p className="font-semibold !text-gray-700 dark:text-gray-300 mb-1">
                  📌 Loans:
                </p>
                {shop.loans.map((loan, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between !text-gray-800 dark:text-gray-200 mb-1">
                      <span>Loan Amount: ₹{loan.loanAmount}</span>
                      <span>EMI: ₹{loan.emiPerMonth}</span>
                      <span
                        className={
                          loan.isLoanActive
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >
                        {loan.isLoanActive ? "Active" : "Closed"}
                      </span>
                    </div>

                    {/* Last 5 EMI Payments Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left border border-gray-300 text-sm">
                        <thead className="!bg-gray-300">
                          <tr>
                            <th className="px-3 py-1 border-b border-gray-300">
                              Month/Year
                            </th>
                            <th className="px-3 py-1 border-b border-gray-300">
                              Status
                            </th>
                            <th className="px-3 py-1 border-b border-gray-300">
                              Paid Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loan.emiPaymentHistory.slice(-5).map((emi, idx2) => (
                            <tr key={idx2} className="bg-gray-50">
                              <td className="px-3 py-1 border-b border-gray-300">
                                {`${String(emi.month).padStart(2, "0")}/${emi.year}`}
                              </td>
                              <td className="px-3 py-1 border-b border-gray-300">
                                {emi.isEmiPaid ? "✅ Paid" : "❌ Unpaid"}
                              </td>
                              <td className="px-3 py-1 border-b border-gray-300">
                                {emi.paidDate
                                  ? new Date(emi.paidDate).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-4">
                No loans assigned
              </p>
            )}
          </div>
        ))}
        {tenant?.shopsAllotted.length === 0 && (
          <div>
            <p className="italic text-gray-900">
              No Shops Allotted to this Tenant
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTenantsDetailsPage;
