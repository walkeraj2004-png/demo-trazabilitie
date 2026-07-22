import { Suspense } from "react";
import { CajaView } from "@/features/caja/CajaView";

/* useSearchParams exige un límite de Suspense para el prerender estático. */
export default function CajaPage() {
  return (
    <Suspense fallback={<main className="caja-main" />}>
      <CajaView />
    </Suspense>
  );
}
