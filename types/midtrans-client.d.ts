import "midtrans-client";

declare module "midtrans-client" {
  interface SnapTransactionParameters {
    item_details?: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email: string;
      phone: string;
    };
    expiry?: {
      unit: "minutes" | "hours" | "days";
      duration: number;
    };
    callbacks?: {
      finish: string;
    };
  }
}
