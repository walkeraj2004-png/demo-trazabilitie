/** @type {import('next').NextConfig} */

/* Subpath del deploy en GitHub Pages (proyecto, no dominio propio). Vacío
   en local/dev; el workflow de CI lo fija a "/demo-trazabilitie" solo para
   el build de producción. Debe coincidir con NEXT_PUBLIC_BASE_PATH en
   src/config.ts (mismos assets/enlaces escritos a mano necesitan el mismo
   prefijo, ya que basePath de Next solo afecta a <Link>/router). */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages solo sirve archivos estáticos: sin servidor Node, sin API
  // routes. `output: "export"` genera un `out/` 100% estático. Esto deja
  // de ser viable en cuanto F1 (fusión Xpotrack/couriers) necesite un
  // backend real; en ese punto el deploy se muda a un host con servidor.
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // `legacy/` conserva el demo estático original solo como referencia;
  // no forma parte del build.
};

export default nextConfig;
