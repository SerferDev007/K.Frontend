import { useState, useEffect, useRef, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import { getAllTenants, getShopsByTenant } from "@/services/tenantApi";
import { getTenantReports } from "@/services/reportsServices";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Tenant {
  _id: string;
  tenantName: string;
}

interface AssignedShop {
  shopNo: string;
}

const TenantsReports: React.FC = () => {
  const { t } = useTranslation();
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [assignedShops, setAssignedShops] = useState<AssignedShop[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Fetch tenants on mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await getAllTenants();
        setAllTenants(res.tenants || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tenants");
      }
    };
    fetchTenants();
  }, []);

  // Fetch shops when tenant changes
  useEffect(() => {
    const fetchShops = async () => {
      if (!selectedTenantId) return setAssignedShops([]);
      try {
        const res = await getShopsByTenant(selectedTenantId);
        setAssignedShops(res.shops || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load shops");
      }
    };
    fetchShops();
  }, [selectedTenantId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTenantId && !month && !year && !selectedShop) {
      toast.error("Select at least one filter or leave blank for all tenants");
      return;
    }

    try {
      setLoading(true);

      // Find selected tenant object to get the name
      const tenant = allTenants.find((t) => t._id === selectedTenantId);

      // Prepare report params
      const reportParams: Record<string, string | number> = {};
      if (selectedTenantId) reportParams.tenantId = selectedTenantId;
      if (tenant) reportParams.tenantName = tenant.tenantName; // pass name
      if (selectedShop) reportParams.shopNo = selectedShop;
      if (month) reportParams.month = Number(month);
      if (year) reportParams.year = Number(year);

      await getTenantReports(reportParams);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download tenant report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center mt-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-4 border-4 border-blue-600 rounded-2xl w-full max-w-4xl"
      >
        <h3 className="text-center text-2xl font-bold mb-4 text-gray-900">
          {t("downloadTenantReport")}
        </h3>
        <div className="flex justify-center gap-3 w-full">
          {/* Tenant Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              {t("selectTenant")}
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="border-2 rounded-xl w-full p-2 text-gray-900 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- {t("allTenants")} --</option>
              {allTenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.tenantName}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              {t("shopNumber")}*
            </label>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="border-2 rounded-xl w-full p-2 text-gray-900 focus:ring-1 focus:ring-blue-500"
              disabled={!assignedShops.length}
            >
              <option value="">-- {t("allShops")} --</option>
              {assignedShops.map((shop) => (
                <option key={shop.shopNo} value={shop.shopNo}>
                  {shop.shopNo}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              {t("month")}*
            </label>
            <input
              type="number"
              min={1}
              max={12}
              placeholder="1-12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-2 rounded-xl w-full p-2 text-gray-900 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Year Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              {t("year")}*
            </label>
            <input
              type="number"
              min={2025}
              max={2100}
              placeholder={new Date().getFullYear().toString()}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border-2 rounded-xl w-full p-2 text-gray-900 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white !rounded-xl px-6 py-2"
            disabled={loading}
          >
            {loading ? t("processing") : t("downloadReport")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TenantsReports;
