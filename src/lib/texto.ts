const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

/** Minúsculas y sin acentos, para comparar texto sin depender de mayúsculas/tildes. */
export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(DIACRITICS_REGEX, "").toLowerCase();
}

export function coincideBusqueda(texto: string, busqueda: string): boolean {
  return normalizarTexto(texto).includes(normalizarTexto(busqueda));
}
