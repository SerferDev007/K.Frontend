import { useState } from "react";
import PaymentForm from "./PaymentForm";
import ShopForm from "../Tenants/ShopForm";
import { Button } from "../UI/Button";
import { useAuth } from "@/hooks/useAuth";
import TenantsDetails from "./TenantsDetails";

const Tenants = () => {
  const [isPaymentForm, setIsPaymentForm] = useState(false);
  const [isShopForm, setIsShopForm] = useState(false);

  const { token } = useAuth();

  const addRentBtnHandler = () => {
    setIsPaymentForm(true);
    setIsShopForm(false);
  };

  const addShopBtnHandler = () => {
    setIsShopForm(true);
    setIsPaymentForm(false);
  };

  return (
    <div className="relative w-full min-h-screen p-6">
      {/* Header Section */}
      {!isPaymentForm && !isShopForm && (
        <div className="flex flex-col md:flex-row justify-between items-center border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-3 mb-6">
          <h4 className="text-xl md:text-2xl font-extrabold !text-white-800 dark:text-gray-100 tracking-tight">
            🏢 Manage Tenants
          </h4>
          <div className="flex gap-4 mt-3 md:mt-0">
            <Button
              className="!rounded-xl bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-orange-300 hover:to-orange-500 !text-gray-900 dark:text-white font-semibold shadow-md px-4 py-2"
              onClick={addRentBtnHandler}
            >
              ➕ Add Rent
            </Button>
            <Button
              className="!rounded-xl bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-orange-300 hover:to-orange-500 !text-gray-900 dark:text-white font-semibold shadow-md px-4 py-2"
              onClick={addShopBtnHandler}
            >
              🏬 Add Shop
            </Button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 dark:bg-gray-700 mb-6" />

      {/* Content Section */}
      <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        {isPaymentForm && (
          <PaymentForm
            onBack={() => setIsPaymentForm(false)}
            token={token || ""}
          />
        )}
        {isShopForm && (
          <ShopForm onBack={() => setIsShopForm(false)} token={token || ""} />
        )}
        {!isPaymentForm && !isShopForm && <TenantsDetails />}
      </div>
    </div>
  );
};

export default Tenants;
