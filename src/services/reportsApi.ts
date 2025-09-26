import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const generateReceipt = async (receiptData: {
  tenantId: string;
  shopNo: string;
  month?: number; // optional
  year?: number; // optional
  isRent: boolean;
  isEmi: boolean;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/reports/receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receiptData),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(errorData.message || "Failed to generate receipt");
      return;
    }

    // Convert response to blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Open the PDF in a new tab for printing
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.focus();
        printWindow.print();
      });
      toast.success("Receipt opened for printing!");
    } else {
      toast.error("Unable to open print window. Please allow pop-ups.");
    }

    // Revoke object URL after some delay to ensure PDF loads
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);
  } catch (err) {
    console.error("generateReceipt error:", err);
    toast.error("Something went wrong while generating receipt");
  }
};
