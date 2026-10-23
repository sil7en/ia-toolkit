import type { Herramienta } from "../tipos";

function parsearNumero(val: unknown): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const normalizado = val.trim().replace(",", ".");
    const num = parseFloat(normalizado);
    if (!isNaN(num)) return num;
  }
  throw new Error(`El valor "${String(val)}" no es un número válido.`);
}

function formatearNumero(num: number, decimales = 1): string {
  return num.toFixed(decimales).replace(".", ",");
}

export const herramientaCalcularVariacion: Herramienta = {
  nombre: "calcular_variacion",
  descripcion:
    "Calcula la diferencia entre dos tasas en puntos porcentuales y la variación relativa en porcentaje. Úsala para toda variación de tasas.",
  parametros: {
    type: "object",
    properties: {
      actual: {
        type: "string",
        description: "La tasa más reciente, por ejemplo '9,6' o 9.6.",
      },
      anterior: {
        type: "string",
        description: "La tasa con la que se compara, por ejemplo '8,6' o 8.6.",
      },
    },
    required: ["actual", "anterior"],
  },
  async ejecutar(args, _ctx) {
    const actualNum = parsearNumero(args.actual);
    const anteriorNum = parsearNumero(args.anterior);

    if (anteriorNum === 0) {
      throw new Error("La tasa anterior no puede ser cero para calcular la variación relativa.");
    }

    const diffPp = actualNum - anteriorNum;
    const varRel = ((actualNum - anteriorNum) / anteriorNum) * 100;

    const diffPpStr = `${formatearNumero(diffPp)} pp.`;
    const varRelStr = `${formatearNumero(varRel)}%`;

    let explicacion = "";
    const actualStr = `${formatearNumero(actualNum)}%`;
    const anteriorStr = `${formatearNumero(anteriorNum)}%`;
    const absDiffPpStr = `${formatearNumero(Math.abs(diffPp))} pp.`;

    if (diffPp > 0) {
      explicacion = `La tasa pasó de ${anteriorStr} a ${actualStr}, lo que representa un aumento de ${absDiffPpStr} (${varRelStr} de variación relativa).`;
    } else if (diffPp < 0) {
      explicacion = `La tasa pasó de ${anteriorStr} a ${actualStr}, lo que representa una disminución de ${absDiffPpStr} (${varRelStr} de variación relativa).`;
    } else {
      explicacion = `La tasa se mantuvo sin cambios en ${actualStr} (0,0 pp. y 0,0% de variación relativa).`;
    }

    return {
      actual: actualNum,
      anterior: anteriorNum,
      diferenciaPp: diffPpStr,
      variacionRelativa: varRelStr,
      explicacion,
    };
  },
};
