import { useState } from "react";
import { Button } from "@/components/UI/Button";
import { getFinanceReport } from "@/services/reportsServices";
import toast from "react-hot-toast";

const FinanceReports: React.FC = () => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [type, setType] = useState<"donation" | "expense">("donation");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!month && !year) {
      toast.error(
        "Please select at least month or year (or leave blank for all)"
      );
      return;
    }

    try {
      setLoading(true);
      await getFinanceReport({
        type,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border-4 rounded-2xl w-full max-w-4xl"
      >
        <h3 className="text-center text-2xl font-bold">
          Download Finance Report
        </h3>
        <div className="flex justify-center gap-3 w-full">
          {/* Type Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              Report Type*
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "donation" | "expense")
              }
              className="border-2 rounded-xl w-full p-2 text-gray-900 focus:ring-1 focus:ring-blue-500"
            >
              <option value="donation">Donation</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              Month*
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
              Year*
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white !rounded-xl py-2 px-6"
          >
            {loading ? "Generating..." : "Download Report"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FinanceReports;
