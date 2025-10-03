import { useState } from "react";
import DonationForm from "./DonationForm";
import { Button } from "../UI/Button";
import ViewDonations from "./ViewDonations";

const Donations = () => {
  const [isDonationForm, setIsDonantionForm] = useState(false);

  const addDonationBtnhandler = () => {
    setIsDonantionForm(true);
  };
  return (
    <div className="relative w-full min-h-screen">
      {/* Button fixed at top-right of this div */}
      {!isDonationForm && (
        <>
          {" "}
          <div className="w-full h-px bg-gray-300 my-2" />
          <div className="flex justify-between items-center m-2">
            <h4 className="text-lg font-bold text-white dark:text-gray-100">
              Manage Donations
            </h4>
            <Button
              className="!rounded-xl bg-blue-600 hover:bg-blue-300 !text-white disabled:cursor-not-allowed"
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
          <DonationForm onBack={() => setIsDonantionForm(false)} />
        ) : (
          <ViewDonations />
        )}
      </div>
    </div>
  );
};

export default Donations;
