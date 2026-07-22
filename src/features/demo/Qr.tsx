"use client";
/* =====================================================================
   TrazaFlor · demo · código QR
   Genera el QR en el cliente (data URL) desde la url dada. Si la librería
   falla, cae a un texto en vez de romper la tarjeta.
   ===================================================================== */
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useT } from "@/i18n";

export function Qr({ url, size = 72 }: { url: string; size?: number }) {
  const t = useT();
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    QRCode.toDataURL(url, { width: size, margin: 0, errorCorrectionLevel: "M" })
      .then((d) => vivo && setSrc(d))
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, [url, size]);

  if (error) {
    return (
      <span className="qr-slot qr-fallback" style={{ width: size, height: size }}>
        {t("qr_no_disponible")}
      </span>
    );
  }

  return (
    <span className="qr-slot" style={{ width: size, height: size }}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={size} height={size} />
      )}
    </span>
  );
}
