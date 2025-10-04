import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import {
  getAllTenants,
  assignShop,
  getAvailableShops,
} from "@/services/tenantApi";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface ShopFormProps {
  onBack: () => void;
  token: string; // token for assignShop API
}

interface ShopData {
  shopNo: string;
  rentAmount: number;
  deposit: number;
  agreementDate: string;
  agreementFile?: File;
}

interface Tenant {
  _id: string;
  tenantName: string;
}

const ShopForm: React.FC<ShopFormProps> = ({ onBack, token }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [availableShops, setAvailableShops] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch tenants once
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

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getAvailableShops();
        setAvailableShops(data.availableShops || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch available shops");
      }
    };

    fetchShops();
  }, []);

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedTenantId) newErrors.tenantName = "Please select a tenant";
    if (!formData.get("shopNo")?.toString().trim())
      newErrors.shopNo = "Shop number is required";
    if (!formData.get("rentAmount")?.toString().trim())
      newErrors.rentAmount = "Rent amount is required";
    else if (isNaN(Number(formData.get("rentAmount"))))
      newErrors.rentAmount = "Rent amount must be a number";
    if (!formData.get("deposit")?.toString().trim())
      newErrors.deposit = "Deposit amount is required";
    else if (isNaN(Number(formData.get("deposit"))))
      newErrors.deposit = "Deposit amount must be a number";
    if (!formData.get("agreementDate")?.toString().trim())
      newErrors.agreementDate = "Agreement start date is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const shopData: ShopData = {
      shopNo: formData.get("shopNo")?.toString() || "",
      rentAmount: Number(formData.get("rentAmount")),
      deposit: Number(formData.get("deposit")),
      agreementDate: formData.get("agreementDate")?.toString() || "",
    };

    const agreementFile = formData.get("agreementFile") as File | null;
    if (agreementFile) shopData.agreementFile = agreementFile;

    try {
      setLoading(true);
      const res = await assignShop(selectedTenantId, shopData, token);
      if (res.success) {
        toast.success(res.message || "Shop assigned successfully!");
        setSelectedTenantId("");
        formRef.current?.reset();
        setErrors({});
      } else {
        toast.error(res.message || "Failed to assign shop");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full justify-center max-h-screen">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="md:px-8 w-full max-w-2xl p-3 rounded-lg border-4 border-blue-600 !bg-gray-100 dark:bg-gray-500 !text-black dark:text-gray-100 shadow-sm"
        >
          <div className="text-center">
            <h3 className="font-bold text-2xl text-black dark:text-gray-100">
              {t("assignShop")}
            </h3>
          </div>
          <div className="w-full h-px bg-black m-2 mt-3" />

          {/* Tenant Dropdown */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
              {t("tenant")} {t("select")}
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.tenantName ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">
                -- {t("tenant")} {t("select")} --
              </option>
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

          {/* Shop Number, Rent, Deposit, AgreementStart, File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {/* Shop Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
                {t("shopNumber")}
              </label>
              <select
                name="shopNo"
                className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                  errors.shopNo ? "border-red-500" : "border-gray-200"
                }`}
                defaultValue=""
              >
                <option value="">
                  -- {t("shop")} {t("select")} --
                </option>
                {availableShops.map((shop) => (
                  <option key={shop} value={shop}>
                    {shop}
                  </option>
                ))}
              </select>

              {errors.shopNo && (
                <p className="text-red-500 text-sm mt-1">{errors.shopNo}</p>
              )}
            </div>
            {/* Agreement Start */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
                {t("agreementStart")}
              </label>
              <input
                type="date"
                name="agreementDate"
                className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                  errors.agreementDate ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.agreementDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreementDate}
                </p>
              )}
            </div>
          </div>

          {/* Rent & Deposit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
                {t("rent")} {t("amount")}
              </label>
              <input
                type="number"
                name="rentAmount"
                placeholder={`${t("payRentAmount")}`}
                className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                  errors.rentAmount ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.rentAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.rentAmount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
                {t("depositAmount")}
              </label>
              <input
                type="number"
                name="deposit"
                placeholder={`${t("enterDepositAmount")}`}
                className={`focus-visible:ring-1 border-2 rounded-xl w-full p-2 text-gray-900 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-300 ${
                  errors.deposit ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.deposit && (
                <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
              )}
            </div>
          </div>

          {/* Agreement File Upload */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
              {t("agreement")} (PDF {t("only")}, max 2MB)
            </label>
            <input
              type="file"
              name="agreementFile"
              accept=".pdf"
              className="focus-visible:ring-1 border-2 border-gray-200 rounded-xl w-full p-2 cursor-pointer text-gray-900 dark:text-gray-100 file:py-1 file:px-3 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4 gap-2">
            <Button
              type="button"
              onClick={onBack}
              className="flex-1 !rounded-xl bg-gray-700 hover:bg-gray-900 text-white"
            >
              {t("back")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 !rounded-xl bg-blue-600 hover:bg-blue-400 text-white"
            >
              {loading ? t("processing") : t("assignShop")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShopForm;
