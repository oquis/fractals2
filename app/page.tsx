import FractalGenerator from "@/components/FractalGenerator";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <FractalGenerator />;
    </Suspense>
  );
}
