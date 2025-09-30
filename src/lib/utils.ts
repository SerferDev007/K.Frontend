import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Types aligned with Rents domain
export interface RentPayment {
  year: number;
  month: number; // 1-12
  isPaid: boolean;
}

export interface EmiPayment {
  year: number;
  month: number; // 1-12
  isEmiPaid: boolean;
}

export interface Loan {
  emiPaymentHistory?: EmiPayment[];
}

export interface Shop {
  rentPaymentHistory?: RentPayment[];
  loans?: Loan[];
}

export interface TenantLike {
  shopsAllotted?: Shop[];
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCookie = (name: string): string | undefined => {
  const cookieString = document.cookie;
  const cookies = cookieString
    .split("; ")
    .reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};

export const getUnpaidTenantsLastMonth = <T extends TenantLike>(
  tenants: T[]
): T[] => {
  if (!tenants?.length) return [];

  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth() + 1; // 1-12

  return tenants.filter((tenant) => {
    if (!tenant.shopsAllotted?.length) return false; // must have shop/loan

    return tenant.shopsAllotted.some((shop) => {
      // ----- Rent Check -----
      let rentUnpaid = false;
      if (shop.rentPaymentHistory) {
        const rentEntry = shop.rentPaymentHistory.find(
          (r) => r.year === year && r.month === month
        );
        if (!rentEntry) {
          rentUnpaid = true; // no record = unpaid
        } else if (rentEntry.isPaid === false) {
          rentUnpaid = true; // explicitly unpaid
        }
      } else {
        rentUnpaid = true; // no history = unpaid
      }

      // ----- EMI Check -----
      let emiUnpaid = false;
      if (shop.loans?.length) {
        emiUnpaid = shop.loans.some((loan) => {
          if (loan.emiPaymentHistory) {
            const emiEntry = loan.emiPaymentHistory.find(
              (e) => e.year === year && e.month === month
            );
            if (!emiEntry) {
              return true; // no record = unpaid
            } else if (emiEntry.isEmiPaid === false) {
              return true; // explicitly unpaid
            }
          }
          return true; // no emi history at all = unpaid
        });
      }

      return rentUnpaid || emiUnpaid;
    });
  });
};
