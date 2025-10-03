import { useState } from "react";
import { Button } from "../UI/Button";
import ViewExpenses from "./ViewExpenses"; // your expense listing
import ExpenseForm from "./ExpenseForm";

const Expenses = () => {
  const [isExpenseForm, setIsExpenseForm] = useState(false);

  const addExpenseBtnHandler = () => {
    setIsExpenseForm(true);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Header + Button */}
      {!isExpenseForm && (
        <>
          <div className="w-full h-px bg-gray-300 my-2" />
          <div className="flex justify-between items-center m-2">
            <h4 className="text-lg font-bold text-white dark:text-gray-100">
              Manage Expenses
            </h4>
            <Button
              className="!rounded-xl bg-blue-600 hover:bg-blue-400 !text-white dark:text-white disabled:cursor-not-allowed"
              onClick={addExpenseBtnHandler}
            >
              Add Expense
            </Button>
          </div>
        </>
      )}

      <div className="w-full h-px bg-gray-300 my-2" />

      {/* Content */}
      <div>
        {isExpenseForm ? (
          <ExpenseForm onBack={() => setIsExpenseForm(false)} />
        ) : (
          <ViewExpenses />
        )}
      </div>
    </div>
  );
};

export default Expenses;
