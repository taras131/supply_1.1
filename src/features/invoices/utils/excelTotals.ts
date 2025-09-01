// utils/excel-totals.ts
import * as XLSX from "xlsx";

const moneyToNumber = (s: unknown): number | null => {
    if (s == null) return null;
    const str = String(s).replace(/\u00A0/g, " ").trim();
    if (!str) return null;
    // допускаем "98 740,64" / "98740.64"
    const norm = str.replace(/\s/g, "").replace(",", ".");
    const n = Number(norm);
    return Number.isFinite(n) ? n : null;
};

// Метки для поиска
const LABELS = {
    total: /^(итого)\s*:?\s*$/i,
    totalWithVat: /^(итого\s*с\s*ндс|всего\s*с\s*учетом\s*ндс)\s*:?\s*$/i,
    vatLine: /^(в\s*т\.?\s*ч\.?\s*ндс|сумма\s*ндс)\s*:?\s*$/i,
    totalFreeText: /(итого|всего\s*к\s*оплате|итого\s*с\s*ндс)/i, // на всякий случай
};

// Прочитать ячейку по адресу
const readCell = (ws: XLSX.WorkSheet, addr: string) => ws[addr]?.v ?? null;

// Попробовать взять число справа или снизу от метки
const valueNear = (ws: XLSX.WorkSheet, r: number, c: number): number | null => {
    const rightAddr = XLSX.utils.encode_cell({ r, c: c + 1 });
    const belowAddr = XLSX.utils.encode_cell({ r: r + 1, c });

    const right = readCell(ws, rightAddr);
    const below = readCell(ws, belowAddr);

    // сперва справа, затем снизу
    return moneyToNumber(right) ?? moneyToNumber(below);
};

export type ExcelTotals = {
    amount?: number | null;         // Итого/Всего к оплате
    amountWithVat?: number | null;  // Итого с НДС
    vatAmount?: number | null;      // Сумма НДС (если нужна)
    vatPercent?: number | null;
};

export function extractExcelTotals(file: File): Promise<ExcelTotals> {
    return new Promise(async (resolve, reject) => {
        try {
            const buf = await file.arrayBuffer();
            const wb = XLSX.read(buf, { type: "array" });

            const result: ExcelTotals = {};

            for (const sheetName of wb.SheetNames) {
                const ws = wb.Sheets[sheetName];
                if (!ws || !ws["!ref"]) continue;

                const range = XLSX.utils.decode_range(ws["!ref"]);
                for (let r = range.s.r; r <= range.e.r; r++) {
                    for (let c = range.s.c; c <= range.e.c; c++) {
                        const addr = XLSX.utils.encode_cell({ r, c });
                        const raw = readCell(ws, addr);
                        if (!raw) continue;

                        const text = String(raw).replace(/\u00A0/g, " ").trim();

                        // ИТОГО (общая сумма)
                        if (LABELS.total.test(text)) {
                            const val = valueNear(ws, r, c);
                            if (val != null) result.amount = val;
                        }

                        // ИТОГО С НДС
                        if (LABELS.totalWithVat.test(text)) {
                            const val = valueNear(ws, r, c);
                            if (val != null) result.amountWithVat = val;
                        }

                        // В т.ч. НДС / Сумма НДС
                        if (LABELS.vatLine.test(text)) {
                            // Число рядом
                            const val = valueNear(ws, r, c);
                            if (val != null) result.vatAmount = val;

                            // Попробуем вытащить процент прямо из текста ячейки, если указан, например: "В т.ч. НДС (20%)"
                            const pct = /$(\d{1,2})\s*%$/i.exec(text)?.[1];
                            if (pct && !result.vatPercent) result.vatPercent = Number(pct);
                        }
                    }
                }
            }

            // Если явно найдено "Итого с НДС" — используем как amount при отсутствии amount
            if (result.amount == null && result.amountWithVat != null) {
                result.amount = result.amountWithVat;
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}
