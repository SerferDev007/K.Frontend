import { useState } from "react";
import DonationForm from "./DonationForm";
import { Button } from "../UI/Button";
import ViewDonations from "./ViewDonations";

const Donations = () => {
  const [isDonationForm, setIsDonantionForm] = useState(false);

  // Sample categories and sub-categories - in real app, these would come from API
  const categories = ["Education", "Health", "Food", "Clothing", "Other"];
  const subCategories = [
    "Books",
    "Medicine",
    "Meals",
    "Clothes",
    "Stationery",
    "Emergency",
  ];

  const addDonationBtnhandler = () => {
    setIsDonantionForm(true);
  };
  return (
    <div className="relative w-full p-4 min-h-screen">
      {/* Button fixed at top-right of this div */}
      {!isDonationForm && (
        <>
          {" "}
          <div className="w-full h-px bg-gray-300 my-2" />
          <div className="flex justify-between items-center m-2">
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Manage Donations
            </h4>
            <Button
              className="!rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900 dark:text-white disabled:cursor-not-allowed"
              onClick={addDonationBtnhandler}
            >
              Add Donation
            </Button>
          </div>
        </>
      )}

      <div className="w-full h-px bg-gray-300 my-2" />

      {/* Content */}
      <div>
        {isDonationForm ? (
          <DonationForm
            onBack={() => setIsDonantionForm(false)}
            categories={categories}
            subCategories={subCategories}
          />
        ) : (
          <ViewDonations />
        )}
      </div>
    </div>
  );
};

export default Donations;
