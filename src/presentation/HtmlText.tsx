/* =====================================================================
   TrazaFlor · presentación · texto traducido con HTML embebido
   Algunas cadenas de i18n incluyen <strong>/<br> para dar énfasis (no son
   input de usuario). React escapa texto por defecto; este componente es
   el único punto donde se le dice explícitamente que no lo haga.
   ===================================================================== */
export function HtmlText({ html, as: As = "span" }: { html: string; as?: "span" | "p" | "div" }) {
  return <As dangerouslySetInnerHTML={{ __html: html }} />;
}
