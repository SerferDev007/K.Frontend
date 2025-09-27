import { useEffect, useState } from "react";
import { getAllTenants } from "@/services/tenantApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Tenant {
  _id: string;
  tenantName: string;
}

const TenantsDetails = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await getAllTenants();
        setTenants(res.tenants || []);
        setFilteredTenants(res.tenants || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tenants");
      }
    };
    fetchTenants();
  }, []);

  // 🔎 Filter tenants whenever search changes
  useEffect(() => {
    let updated = [...tenants];
    if (searchName.trim()) {
      updated = updated.filter((t) =>
        t.tenantName.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    setFilteredTenants(updated);
  }, [searchName, tenants]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Search bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search by tenant name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="focus-visible:ring-1 border-2 border-gray-300 rounded-xl w-full p-3 text-lg"
        />
      </div>

      {/* Tenant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 w-full max-w-6xl">
        {filteredTenants?.map((tenant) => (
          <div
            key={tenant._id}
            onClick={() => navigate(`/tenants/${tenant._id}`)}
            className="p-3 rounded-xl border-2 border-amber-400 bg-green-300 
              dark:bg-gray-500 text-gray-900 dark:text-gray-100 
              shadow-lg flex items-center !justify-start cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="font-bold !text-lg truncate">{tenant.tenantName}</h3>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <p className="text-gray-700 mt-6 text-lg">No tenants found.</p>
      )}
    </div>
  );
};

export default TenantsDetails;
