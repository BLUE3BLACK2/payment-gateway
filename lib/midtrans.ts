import midtransClient from "midtrans-client";
import { getServerEnv } from "@/lib/env";

export function getMidtransSnap() {
  const env = getServerEnv();

  return new midtransClient.Snap({
    isProduction: env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: env.MIDTRANS_SERVER_KEY,
    clientKey: env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
}
