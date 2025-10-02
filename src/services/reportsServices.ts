import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface TenantReportParams {
  month?: number;
  year?: number;
  tenantId?: string;
  tenantName?: string; // new
  shopNo?: string | number;
}

export const getTenantReports = async (params: TenantReportParams = {}) => {
  try {
    const { month, year, tenantId, tenantName, shopNo } = params;

    // Build query string dynamically
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());
    if (tenantId) queryParams.append("tenantId", tenantId);
    if (shopNo) queryParams.append("shopNo", shopNo.toString());

    const url = `${BASE_URL}/api/reports/tenant${queryParams.toString() ? `?${queryParams}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Failed to fetch tenant reports");
      return null;
    }

    const blob = await res.blob();

    // Build dynamic file name
    let fileName = "tenant_report";
    if (tenantName) fileName += `_Tenant_${tenantName.replace(/\s+/g, "_")}`;
    else if (tenantId) fileName += `_Tenant_${tenantId}`;
    if (shopNo) fileName += `_Shop_${shopNo}`;
    if (month) fileName += `_Month_${month}`;
    if (year) fileName += `_Year_${year}`;

    // Always add generation date
    const reportDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-"); // DD-MM-YYYY
    fileName += `_Generated_${reportDate}.pdf`;

    // Download PDF
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Tenant report downloaded successfully!");
  } catch (err) {
    console.error("Error fetching tenant report:", err);
    toast.error("Something went wrong while fetching report");
  }
};

interface ReportParams {
  month?: number;
  year?: number;
  type: "donation" | "expense";
}

// --- General Finance Reports ---
export const getFinanceReport = async (params: ReportParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.month) queryParams.append("month", params.month.toString());
    if (params.year) queryParams.append("year", params.year.toString());
    queryParams.append("type", params.type);

    const url = `${BASE_URL}/api/reports/finance${queryParams.toString() ? `?${queryParams}` : ""}`;

    const res = await fetch(url, { method: "GET", credentials: "include" });

    if (!res.ok) {
      toast.error(`Failed to fetch ${params.type} report`);
      return;
    }

    const blob = await res.blob();

    const fileNameParts = [`${params.type}_report`];
    if (params.month) fileNameParts.push(`Month_${params.month}`);
    if (params.year) fileNameParts.push(`Year_${params.year}`);
    const reportDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    fileNameParts.push(`Generated_${reportDate}.pdf`);

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileNameParts.join("_");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success(
      `${params.type.charAt(0).toUpperCase() + params.type.slice(1)} report downloaded successfully!`
    );
  } catch (err) {
    console.error(`Error fetching ${params.type} report:`, err);
    toast.error(`Something went wrong while fetching ${params.type} report`);
  }
};
