import Expenses from "../components/Expenses/Expenses";

const ExpensePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-4">
      <Expenses />
    </div>
  );
};

export default ExpensePage;
