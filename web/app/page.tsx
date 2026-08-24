import type { Metadata } from "next";
import { SahiReturnApp } from "./SahiReturnApp";

export const metadata: Metadata = {
  title: "Defective return demo",
  description:
    "An independent prototype that explains and corrects one synthetic Section 139(9) mismatch.",
};

export default function Home() {
  return <SahiReturnApp />;
}
