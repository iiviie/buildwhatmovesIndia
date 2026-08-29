import type { Metadata } from "next";
import { SahiReturnApp } from "./SahiReturnApp";

export const metadata: Metadata = {
  title: "Salaried ITR filing demo",
  description:
    "An independent prototype that files one synthetic salaried return end to end, and checks it for defects before filing.",
};

export default function Home() {
  return <SahiReturnApp />;
}
