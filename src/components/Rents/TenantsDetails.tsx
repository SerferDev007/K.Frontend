import { useEffect, useState } from "react";
import { getAllTenants } from "@/services/tenantApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUnpaidTenantsLastMonth } from "@/lib/utils"; // ✅ use shared util

interface RentPayment {
  year: number;
  month: number;
  isPaid: boolean;
}

interface EmiPayment {
  year: number;
  month: number;
  isEmiPaid: boolean;
}

interface Loan {
  emiPaymentHistory?: EmiPayment[];
}

interface Shop {
  rentPaymentHistory?: RentPayment[];
  loans?: Loan[];
}

interface Tenant {
  _id: string;
  tenantName: string;
  shopsAllotted?: Shop[];
}

const TenantsDetails = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState<"rent" | "emi" | "">("");
  const navigate = useNavigate();

  // compute last month in 1-12 convention
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth() + 1; // 1-12

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await getAllTenants();
        setTenants(res.tenants || []);
        setFilteredTenants(res.tenants || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tenants");
      }
    };
    fetchTenants();
  }, []);

  // 🔎 Filter tenants whenever search/filter changes
  useEffect(() => {
    let updated = [...tenants];

    // ✅ Search filter
    if (searchName.trim()) {
      updated = updated.filter((t) =>
        t.tenantName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // ✅ Rent/EMI unpaid filter (last month)
    if (filterType) {
      updated = getUnpaidTenantsLastMonth(updated).filter((t: Tenant) => {
        if (filterType === "rent") {
          return t.shopsAllotted?.some((shop) => {
            const rentEntry = shop.rentPaymentHistory?.find(
              (r) => r.year === lastYear && r.month === lastMonth
            );
            return !rentEntry || rentEntry.isPaid === false;
          });
        } else if (filterType === "emi") {
          return t.shopsAllotted?.some((shop) =>
            shop.loans?.some((loan) => {
              const emiEntry = loan.emiPaymentHistory?.find(
                (e) => e.year === lastYear && e.month === lastMonth
              );
              return !emiEntry || emiEntry.isEmiPaid === false;
            })
          );
        }
        return true;
      });
    }

    setFilteredTenants(updated);
  }, [searchName, tenants, filterType, lastYear, lastMonth]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Search bar + Filters */}
      <div className="flex md:flex-row gap-4 mb-6 w-full max-w-4xl">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search by tenant name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="focus-visible:ring-1 border-2 border-gray-300 rounded-xl w-1/2 p-2 text-lg"
          />
        </div>

        {/* ✅ Filters */}
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterType === "rent"}
              onChange={() =>
                setFilterType(filterType === "rent" ? "" : "rent")
              }
            />
            <span>Unpaid Rent (Last Month)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterType === "emi"}
              onChange={() => setFilterType(filterType === "emi" ? "" : "emi")}
            />
            <span>Unpaid EMI (Last Month)</span>
          </label>
        </div>
      </div>

      {/* Tenant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full max-w-6xl">
        {filteredTenants?.map((tenant) => (
          <div
            key={tenant._id}
            onClick={() => navigate(`/tenants/${tenant._id}`)}
            className="p-3 rounded-xl border-2 border-amber-400 !bg-yellow-500 
              dark:bg-gray-500 !text-gray-900 dark:text-gray-100 
              shadow-lg flex items-center !justify-start cursor-pointer hover:border-amber-50 hover:scale-105 transition-transform"
          >
            <h3 className="font-bold !text-lg truncate">{tenant.tenantName}</h3>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <p className="text-gray-700 mt-6 text-lg">No tenants found.</p>
      )}
    </div>
  );
};

export default TenantsDetails;
