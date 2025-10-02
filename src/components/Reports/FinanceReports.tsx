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
    <div className="flex justify-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border-4 w-full max-w-md flex flex-col gap-4"
      >
        <h3 className="text-center text-2xl font-bold">
          Download Finance Report
        </h3>

        {/* Type Selector */}
        <div>
          <label className="block mb-1 font-medium">Report Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "donation" | "expense")}
            className="border-2 rounded-xl w-full p-2 focus:ring-1 focus:ring-blue-500"
          >
            <option value="donation">Donation</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label className="block mb-1 font-medium">Month</label>
          <input
            type="number"
            min={1}
            max={12}
            placeholder="1-12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-2 rounded-xl w-full p-2 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Year Selector */}
        <div>
          <label className="block mb-1 font-medium">Year</label>
          <input
            type="number"
            min={2000}
            max={2100}
            placeholder={new Date().getFullYear().toString()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border-2 rounded-xl w-full p-2 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white !rounded-xl py-2 mt-2"
        >
          {loading ? "Generating..." : "Download Report"}
        </Button>
      </form>
    </div>
  );
};

export default FinanceReports;
