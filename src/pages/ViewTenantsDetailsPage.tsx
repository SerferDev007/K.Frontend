interface Loan {
  emiPerMonth: number;
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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/services/tenantApi";
import toast from "react-hot-toast";

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

  if (loading) return <p>Loading...</p>;
  if (!tenant) return <p>Tenant not found</p>;

  return (
    <div className="flex items-center justify-center w-full mx-auto border !border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 my-4">
      <div className="relative w-full mt-2 p-4 h-screen">
        {" "}
        <div
          className="p-2 rounded-xl border-2 border-amber-400 bg-green-300 
              dark:bg-gray-500 text-gray-900 dark:text-gray-100 
              shadow-lg "
        >
          <div className="flex items-center justify-start m-2 gap-6">
            <h2 className="text-2xl font-bold">{tenant.tenantName}</h2>
            <div className="flex items-center gap-3 -mb-3">
              <p>Mobile Number: {tenant.mobileNo}</p>
              <p>Adhar Number: {tenant.adharNo}</p>
            </div>
          </div>

          {tenant.shopsAllotted.map((shop) => (
            <div
              key={shop.shopNo}
              className="grid grid-cols-2 md:grid-cols-2 gap-2 w-1/2 max-w-6xl p-3 m-3 border rounded shadow"
            >
              <p className="font-semibold text-2xl">Shop No: {shop.shopNo}</p>
              <p>Rent Amount: ₹{shop.rentAmount}</p>
              <p>
                Previous Month Rent:{" "}
                {shop.rentPaymentHistory[0]?.isPaid ? "✅ Paid" : "❌ Unpaid"}
              </p>
              {shop.loans?.length ? (
                <div className="mt-2">
                  <p className="font-bold underline">Loans:</p>
                  {shop.loans.map((loan, i) => (
                    <p key={i}>
                      EMI: ₹{loan.emiPerMonth} |{" "}
                      {loan.isLoanActive ? "Active" : "Closed"}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-2 italic text-sm">No loans assigned</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewTenantsDetailsPage;
