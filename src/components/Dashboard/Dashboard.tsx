import { useEffect, useState, useMemo } from "react";
import {
  getAllExpenses,
  getAllDonations,
  type Expense,
  type Donation,
} from "@/services/financeServices";
import { getAllTenants, type TenantData } from "@/services/tenantApi";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DataTable } from "../UI/DataTable";
import {
  Users,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, color }) => (
  <div
    className={`rounded-xl p-3 text-black bg-amber-50 shadow-md flex flex-col gap-1 items-start transition-transform hover:scale-105`}
  >
    <div className="flex items-center gap-2">
      {icon && <div className="text-2xl">{icon}</div>}
      <p className="uppercase tracking-wide text-sm font-medium opacity-90">
        {title}
      </p>
    </div>
    <p className="font-bold text-2xl ps-3" style={{ color }}>
      {value}
    </p>
  </div>
);

const Dashboard = () => {
  const [yearFilter, setYearFilter] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [tenants, setTenants] = useState<TenantData[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantRes, expenseRes, donationRes] = await Promise.all([
          getAllTenants(),
          getAllExpenses(),
          getAllDonations(),
        ]);
        setTenants(tenantRes.tenants || []);
        setExpenses(expenseRes.expenses || []);
        setDonations(donationRes.donations || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ------- Data processing remains same --------
  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        (e) => new Date(e.date).getFullYear().toString() === yearFilter
      ),
    [expenses, yearFilter]
  );
  const filteredDonations = useMemo(
    () =>
      donations.filter(
        (d) => new Date(d.date).getFullYear().toString() === yearFilter
      ),
    [donations, yearFilter]
  );
  const totalTenants = tenants.length;
  const totalExpenses = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const totalDonations = filteredDonations.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );
  const netBalance = totalDonations - totalExpenses;
  const tenantsWithPendingRent = tenants.filter((t) => {
    const hasPendingRent = t.shopsAllotted?.some((shop) =>
      shop.rentPaymentHistory?.some(
        (r) => r.year.toString() === yearFilter && !r.isPaid
      )
    );

    return hasPendingRent;
  });
  const tenantsWithPendingEMI = tenants.filter((t) => {
    const hasPendingEmi = t.shopsAllotted?.some((shop) =>
      shop.loans?.some((loan) =>
        loan.emiPaymentHistory?.some(
          (e) => e.year.toString() === yearFilter && !e.isEmiPaid
        )
      )
    );
    return hasPendingEmi;
  });
  const pendingRentCount = tenantsWithPendingRent.length;
  const pendingEMICount = tenantsWithPendingEMI.length;

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      donations: 0,
      expenses: 0,
    }));
    filteredExpenses.forEach((e) => {
      const monthIndex = new Date(e.date).getMonth();
      months[monthIndex].expenses += Number(e.amount);
    });
    filteredDonations.forEach((d) => {
      const monthIndex = new Date(d.date).getMonth();
      months[monthIndex].donations += Number(d.amount);
    });
    return months;
  }, [filteredExpenses, filteredDonations]);

  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      if (e.category)
        catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFE",
    "#FE6C9F",
  ];

  if (loading) return <p className="text-center mt-6">Loading dashboard...</p>;

  return (
    <div className=" space-y-8 w-full p-5 min-h-screen rounded-xl">
      {/* Year Filter */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <label className="font-semibold text-gray-600">
          {t("selectYear")}:
        </label>
        <input
          type="number"
          min={2025}
          max={2100}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card
          title={t("totalTenants")}
          value={totalTenants}
          icon={<Users />}
          color="blue"
        />
        <Card
          title={t("totalDonations")}
          value={`₹${totalDonations.toLocaleString()}`}
          icon={<TrendingUp />}
          color="green"
        />
        <Card
          title={t("totalExpenses")}
          value={`₹${totalExpenses.toLocaleString()}`}
          icon={<TrendingDown />}
          color="red"
        />
        <Card
          title={t("netBalance")}
          value={`₹${netBalance.toLocaleString()}`}
          icon={<Wallet />}
          color="#6366F1"
        />
        <Card
          title={t("pendingEMI")}
          value={pendingEMICount}
          icon={<AlertTriangle />}
          color="gray"
        />
        <Card
          title={t("pendingRent")}
          value={pendingRentCount}
          icon={<AlertTriangle />}
          color="gray"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("monthlyDonationsVsExpenses")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="donations"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("expensesCategoryBreakdown")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("recentExpenses")}
          </h3>
          <DataTable<Expense>
            data={filteredExpenses.slice(-5).reverse()}
            columns={[
              {
                header: `${t("date")}`,
                accessor: (row: Expense) =>
                  new Date(row.date).toLocaleDateString("en-GB"),
              },
              {
                header: `${t("category")}`,
                accessor: (row: Expense) => row.category,
              },
              {
                header: `${t("amount")}`,
                accessor: (row: Expense) => `₹${row.amount}`,
              },
            ]}
          />
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("recentDonations")}
          </h3>
          <DataTable<Donation>
            data={filteredDonations.slice(-5).reverse()}
            columns={[
              {
                header: `${t("date")}`,
                accessor: (row: Donation) =>
                  new Date(row.date).toLocaleDateString("en-GB"),
              },
              {
                header: `${t("donor")}`,
                accessor: (row: Donation) => row.donorName,
              },
              {
                header: `${t("amount")}`,
                accessor: (row: Donation) => `₹${row.amount}`,
              },
            ]}
          />
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("pendingEMI")}
          </h3>
          <DataTable<TenantData>
            data={tenantsWithPendingEMI}
            columns={[
              {
                header: `${t("tenantName")}`,
                accessor: (row: TenantData) => row.tenantName,
              },
              {
                header: `${t("contact")}`,
                accessor: (row: TenantData) => row.mobileNo,
              },
              {
                header: `${t("amountDue")}`,
                accessor: (row: TenantData) => {
                  const pendingRent =
                    row.shopsAllotted?.reduce((sum, shop) => {
                      const rentDue =
                        shop.rentPaymentHistory?.reduce(
                          (s, r) =>
                            r.year.toString() === yearFilter && !r.isPaid
                              ? s + (shop.rentAmount || 0) + (r.penalty || 0)
                              : s,
                          0
                        ) || 0;
                      return sum + rentDue;
                    }, 0) || 0;

                  const pendingEmi =
                    row.shopsAllotted?.reduce((sum, shop) => {
                      const emiDue =
                        shop.loans?.reduce((s, loan) => {
                          const emi =
                            loan.emiPaymentHistory?.reduce(
                              (s2, e) =>
                                e.year.toString() === yearFilter && !e.isEmiPaid
                                  ? s2 +
                                    (loan.emiPerMonth || 0) +
                                    (e.penalty || 0)
                                  : s2,
                              0
                            ) || 0;
                          return s + emi;
                        }, 0) || 0;
                      return sum + emiDue;
                    }, 0) || 0;

                  return `₹${pendingRent + pendingEmi}`;
                },
              },
            ]}
          />
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-center text-gray-700 uppercase tracking-wide">
            {t("pendingRent")}
          </h3>
          <DataTable<TenantData>
            data={tenantsWithPendingRent}
            columns={[
              {
                header: `${t("tenantName")}`,
                accessor: (row: TenantData) => row.tenantName,
              },
              {
                header: `${t("contact")}`,
                accessor: (row: TenantData) => row.mobileNo,
              },
              {
                header: `${t("amountDue")}`,
                accessor: (row: TenantData) => {
                  const pendingRent =
                    row.shopsAllotted?.reduce((sum, shop) => {
                      const rentDue =
                        shop.rentPaymentHistory?.reduce(
                          (s, r) =>
                            r.year.toString() === yearFilter && !r.isPaid
                              ? s + (shop.rentAmount || 0) + (r.penalty || 0)
                              : s,
                          0
                        ) || 0;
                      return sum + rentDue;
                    }, 0) || 0;

                  const pendingEmi =
                    row.shopsAllotted?.reduce((sum, shop) => {
                      const emiDue =
                        shop.loans?.reduce((s, loan) => {
                          const emi =
                            loan.emiPaymentHistory?.reduce(
                              (s2, e) =>
                                e.year.toString() === yearFilter && !e.isEmiPaid
                                  ? s2 +
                                    (loan.emiPerMonth || 0) +
                                    (e.penalty || 0)
                                  : s2,
                              0
                            ) || 0;
                          return s + emi;
                        }, 0) || 0;
                      return sum + emiDue;
                    }, 0) || 0;

                  return `₹${pendingRent + pendingEmi}`;
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
