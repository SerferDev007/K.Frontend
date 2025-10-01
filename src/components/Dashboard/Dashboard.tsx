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

interface CardProps {
  title: string;
  value: string | number;
}

export const Card: React.FC<CardProps> = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-gray-500">{title}</p>
    <p className="font-semibold text-xl">{value}</p>
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

  // Filter by selected year
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

  // Metrics
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

  // Pending Rent/EMI calculation
  const tenantsWithPending = tenants.filter((t) => {
    const hasPendingRent = t.shopsAllotted?.some((shop) =>
      shop.rentPaymentHistory?.some(
        (r) => r.year.toString() === yearFilter && !r.isPaid
      )
    );

    const hasPendingEmi = t.shopsAllotted?.some((shop) =>
      shop.loans?.some((loan) =>
        loan.emiPaymentHistory?.some(
          (e) => e.year.toString() === yearFilter && !e.isEmiPaid
        )
      )
    );

    return hasPendingRent || hasPendingEmi;
  });
  const pendingRentCount = tenantsWithPending.length;

  // Monthly chart data
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

  // Expense category breakdown
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
    <div className="p-4 space-y-6">
      {/* Year Filter */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">Select Year:</label>
        <input
          type="number"
          min={2000}
          max={2100}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border-2 border-gray-300 rounded px-2 py-1 w-32"
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card title="Total Tenants" value={totalTenants} />
        <Card
          title="Total Donations"
          value={`₹${totalDonations.toLocaleString()}`}
        />
        <Card
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
        />
        <Card title="Net Balance" value={`₹${netBalance.toLocaleString()}`} />
        <Card title="Pending Rent/EMI" value={pendingRentCount} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Donations vs Expenses */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 text-center">
            Monthly Donations vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="donations" stroke="#00C49F" />
              <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 text-center">
            Expense Category Breakdown
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h3 className="font-semibold mb-2 text-center">Recent Expenses</h3>
          <DataTable<Expense>
            data={filteredExpenses.slice(-5).reverse()}
            columns={[
              {
                header: "Date",
                accessor: (row: Expense) =>
                  new Date(row.date).toLocaleDateString(),
              },
              { header: "Category", accessor: (row: Expense) => row.category },
              {
                header: "Amount",
                accessor: (row: Expense) => `₹${row.amount}`,
              },
            ]}
          />
        </div>

        {/* Recent Donations */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h3 className="font-semibold mb-2 text-center">Recent Donations</h3>
          <DataTable<Donation>
            data={filteredDonations.slice(-5).reverse()}
            columns={[
              {
                header: "Date",
                accessor: (row: Donation) =>
                  new Date(row.date).toLocaleDateString(),
              },
              { header: "Donor", accessor: (row: Donation) => row.donorName },
              {
                header: "Amount",
                accessor: (row: Donation) => `₹${row.amount}`,
              },
            ]}
          />
        </div>

        {/* Pending Tenants */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h3 className="font-semibold mb-2 text-center">Pending Rent/EMI</h3>
          <DataTable<TenantData>
            data={tenantsWithPending}
            columns={[
              {
                header: "Tenant Name",
                accessor: (row: TenantData) => row.tenantName,
              },
              {
                header: "Contact",
                accessor: (row: TenantData) => row.mobileNo,
              },
              {
                header: "Amount Due",
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
