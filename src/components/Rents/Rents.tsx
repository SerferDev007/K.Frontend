import { useState } from "react";
import RentForm from "./RentForm";
import ShopForm from "../Tenants/ShopForm";
import { Button } from "../UI/Button";
import ViewRents from "./ViewRents";
import { useAuth } from "@/hooks/useAuth";

const Rents = () => {
  const [isRentForm, setIsRentForm] = useState(false);
  const [isShopForm, setIsShopForm] = useState(false);

  const { token } = useAuth();

  const addRentBtnHandler = () => {
    setIsRentForm(true);
    setIsShopForm(false); // ensure only one form is open
  };

  const addShopBtnHandler = () => {
    setIsShopForm(true);
    setIsRentForm(false); // ensure only one form is open
  };

  return (
    <div className="relative w-full mt-2 p-4 min-h-screen">
      {!isRentForm && !isShopForm && (
        <>
          <div className="w-full h-px bg-gray-300 my-2" />
          <div className="flex justify-between items-center m-2">
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Manage Rents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="!rounded-xl bg-amber-400 hover:bg-orange-400 !text-gray-900 dark:text-white disabled:cursor-not-allowed"
                onClick={addRentBtnHandler}
              >
                Add Rent
              </Button>
              <Button
                className="!rounded-xl bg-amber-400 hover:bg-orange-400 !text-gray-900 dark:text-white disabled:cursor-not-allowed"
                onClick={addShopBtnHandler}
              >
                Add Shop
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="w-full h-px bg-gray-300 my-2" />

      <div>
        {isRentForm && <RentForm onBack={() => setIsRentForm(false)} />}
        {isShopForm && (
          <ShopForm onBack={() => setIsShopForm(false)} token={token || ""} />
        )}
        {!isRentForm && !isShopForm && <ViewRents />}
      </div>
    </div>
  );
};

export default Rents;
