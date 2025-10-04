import { useState } from "react";
import PaymentForm from "./PaymentForm";
import ShopForm from "../Tenants/ShopForm";
import LoanForm from "../Loans/LoanForm";
import { Button } from "../UI/Button";
import { useAuth } from "@/hooks/useAuth";
import TenantsDetails from "./TenantsDetails";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Tenants = () => {
  const { t } = useTranslation();
  const [isPaymentForm, setIsPaymentForm] = useState(false);
  const [isShopForm, setIsShopForm] = useState(false);
  const [isLoanForm, setIsLoanForm] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const addRentBtnHandler = () => {
    setIsPaymentForm(true);
    setIsShopForm(false);
    setIsLoanForm(false);
  };

  const addShopBtnHandler = () => {
    setIsShopForm(true);
    setIsPaymentForm(false);
    setIsLoanForm(false);
  };

  const addLoanBtnHandler = () => {
    setIsLoanForm(true);
    setIsShopForm(false);
    setIsPaymentForm(false);
  };

  const addTenantBtnHandler = () => {
    navigate(`/add-tenant`);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Header Section */}
      {!isPaymentForm && !isShopForm && !isLoanForm && (
        <>
          <div className="w-full h-px bg-gray-300 my-2" />
          <div className="flex justify-between items-center m-2">
            <h4 className="text-xl md:text-2xl font-extrabold !text-white dark:text-gray-100 tracking-tight">
              {t("manageTenants")}
            </h4>
            <div className="flex gap-4  md:mt-0">
              <Button
                className="!rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:text-white font-semibold shadow-md px-3 py-2"
                onClick={addRentBtnHandler}
              >
                ➕ {t("addRent")}
              </Button>
              <Button
                className="!rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:text-white font-semibold shadow-md px-3 py-2"
                onClick={addShopBtnHandler}
              >
                🏬 {t("assignShop")}
              </Button>
              <Button
                className="!rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:text-white font-semibold shadow-md px-3 py-2"
                onClick={addLoanBtnHandler}
              >
                🪙 {t("assignLoan")}
              </Button>
              <Button
                className="!rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white dark:text-white font-semibold shadow-md px-3 py-2"
                onClick={addTenantBtnHandler}
              >
                ➕ {t("addTenant")}
              </Button>
            </div>
          </div>
          <div className="w-full h-px bg-gray-300 my-2" />
        </>
      )}

      {/* Content Section */}

      <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 ">
        {isPaymentForm && (
          <PaymentForm
            onBack={() => setIsPaymentForm(false)}
            token={token || ""}
          />
        )}
        {isShopForm && (
          <ShopForm onBack={() => setIsShopForm(false)} token={token || ""} />
        )}
        {isLoanForm && (
          <LoanForm onBack={() => setIsLoanForm(false)} token={token || ""} />
        )}
        {!isPaymentForm && !isShopForm && !isLoanForm && <TenantsDetails />}
      </div>
    </div>
  );
};

export default Tenants;
