import * as XLSX from "xlsx";

export type ParsedInvoice = {
    number?: string | null;
    numberDate?: string | null;
    supplierInn?: string | null;
    supplierName?: string | null;
    isWithVat?: boolean | null;
    vatPercent?: number | null;
    amount?: number | null;
    amountWithVat?: number | null;
    raw?: string;
};

const NBSP = /\u00A0/g;
const norm = (s: string) => String(s ?? "").replace(NBSP, " ").replace(/\s+/g, " ").trim();

const moneyToNumber = (val: unknown): number | null => {
    if (val == null) return null;
    if (typeof val === "number" && Number.isFinite(val)) return val;
    const str = norm(String(val)).replace(/\s/g, "").replace(",", ".");
    const n = Number(str);
    return Number.isFinite(n) ? n : null;
};

const isNumericLike = (v: unknown) => {
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v !== "string") return false;
    const s = v.replace(NBSP, " ").trim();
    return /^-?\d[\d\s]*(?:[.,]\d+)?$/.test(s);
};

const INN_RE = /ИНН\D{0,12}(\d{10,12})/i;
const INN_ONLY = /\b(\d{10}|\d{12})\b/;
const VAT_PCT = /(\d{1,2})\s*%/i;

// Ячейка по координатам/мерджам
function readCell(ws: XLSX.WorkSheet, r: number, c: number): any {
    const addr = XLSX.utils.encode_cell({r, c});
    return ws[addr]?.v;
}

// Поиск значения рядом с меткой (справа → ниже → поиск по строке)
function valueNear(ws: XLSX.WorkSheet, r: number, c: number, row: any[]): number | null {
    // справа
    let v = readCell(ws, r, c + 1);
    let num = moneyToNumber(v);
    if (num != null) return num;

    // ниже
    v = readCell(ws, r + 1, c);
    num = moneyToNumber(v);
    if (num != null) return num;

    // по строке справа до 6 столбцов
    for (let cc = c + 1; cc <= c + 6 && cc < row.length; cc++) {
        const cell = row[cc];
        if (cell == null) continue;
        if (isNumericLike(cell)) {
            const n = moneyToNumber(cell);
            if (n != null) return n;
        }
    }

    // inline в самой метке: "Итого: 98 740,64"
    const inline = norm(row[c]);
    const m = /(Итого(?:\s*с\s*НДС)?|Всего\s*к\s*оплате)[^0-9]*([0-9\s.,]+)/i.exec(inline);
    if (m) return moneyToNumber(m[2]);
    return null;
}

// Достаём суммы, ИНН и поставщика из XLSX построчно
export async function parseExcelInvoice(file: File): Promise<ParsedInvoice> {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, {type: "array"});

    const out: ParsedInvoice = {};
    const lines: string[] = [];
    let amountRead = false
    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        if (!ws || !ws["!ref"]) continue;
        const rows = XLSX.utils.sheet_to_json(ws, {header: 1, raw: true, defval: ""}) as any[][];

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r].map((x: any) => norm(x));

            // Суммы
            for (let c = 0; c < row.length; c++) {

                const cellText = row[c].toLowerCase();
                if (!!cellText && amountRead) {
                    console.log(cellText)
                    out.amount = +cellText;
                    amountRead = false
                }
                if (cellText === "итого" || cellText === "итого:") {
                    amountRead = true
                }

                // Итого / Всего к оплате / Итого с НДС
                /*   if (/^итого\s*:?$/i.test(cellText)
                       || /^итого\s*с\s*ндс\s*:?$/i.test(cellText)
                       || /^всего\s*к\s*оплате\s*:?$/i.test(cellText)) {
                       const val = valueNear(ws, r, c, rows[r]);
                       if (/итого\s*с\s*ндс/i.test(cellText)) {
                           if (val != null) out.amountWithVat = val;
                       } else if (/всего\s*к\s*оплате/i.test(cellText)) {
                           if (val != null) out.amount = val;
                       } else if (/^итого$/i.test(cellText) || /^итого\s*:$/i.test(cellText)) {
                           if (val != null && out.amount == null) out.amount = val;
                       }
                   }*/

                // В т.ч. НДС / Сумма НДС — для флага isWithVat и процента
                if (/^(в\s*т\.?\s*ч\.?\s*ндс|сумма\s*ндс)\s*:?\s*$/i.test(cellText)) {
                    out.isWithVat = true;
                    const pctInline = VAT_PCT.exec(cellText);
                    if (pctInline && !out.vatPercent) out.vatPercent = Number(pctInline[1]);
                }

                // Поставщик + ИНН (рядом)
                if (/^поставщик\b/i.test(cellText) || /^поставщик\s*:/.test(cellText)) {
                    // имя поставщика — текст справа/после "Поставщик"
                    // (очень зависит от шаблона; часто в той же строке или +1 строка)
                    // попытаемся взять остаток в этой ячейке после "Поставщик"
                    const nameInline = cellText.replace(/^поставщик\s*:?\s*/i, "").trim();
                    if (nameInline && !out.supplierName) out.supplierName = nameInline.replace(/["«»]/g, "").trim();

                    // попробуем найти ИНН в ближайших 3 строках/6 столбцах
                    let foundInn: string | null = null;
                    for (let rr = r; rr <= Math.min(r + 3, rows.length - 1) && !foundInn; rr++) {
                        for (let cc = Math.max(0, c - 1); cc <= Math.min(c + 6, row.length - 1) && !foundInn; cc++) {
                            const txt = norm(rows[rr][cc]);
                            const m = INN_RE.exec(txt) || INN_ONLY.exec(txt);
                            if (m) foundInn = m[1];
                        }
                    }
                    if (foundInn) out.supplierInn = foundInn;
                }
            }

            // строка для текстового парсинга ниже
            lines.push(row.join(" "));
        }
    }

    // Запасной парсинг по слепленному тексту (номер, дата, НДС-пометки и т. п.)
    const fullText = norm(lines.join("\n"));
    out.raw = fullText;

    // Номер/дата (из PDF-парсера): допускаем "Счет на оплату № ..."
    const mNum =
        /(Сч[её]т(?:[-\s]?договор)?(?:\s*на\s*оплату)?)\s*(?:№|N[º°o]?|No\.?)\s*([A-Za-zА-Яа-я0-9/_-]+(?:\s+[A-Za-zА-Яа-я0-9/_-]+)*)\s*(?:от\s*([0-3]?\d(?:\.\d{2}\.\d{4}|[.\s][А-Яа-я\w]+\.?\s*\d{4})))?/iu.exec(fullText);
    if (mNum) {
        out.number = (mNum[2] || "").replace(/\s{2,}/g, " ").trim() || out.number || null;
        out.numberDate = mNum[3]?.trim() || out.numberDate || null;
    }

    // ИНН (если не нашли рядом с "Поставщик"): возьмём первый ИНН в верхней части
    if (!out.supplierInn) {
        const supWin =
            /Поставщик[^\S\r\n]*:?[^\n]{0,200}/i.exec(fullText)?.[0] ||
            /Банк\s+получателя[^\n]{0,300}/i.exec(fullText)?.[0] ||
            fullText.slice(0, 2000);
        const mInn = /ИНН\D{0,12}(\d{10,12})/i.exec(supWin) || INN_ONLY.exec(supWin);
        if (mInn) out.supplierInn = mInn[1];
    }

    // НДС пометка без сумм — "Без НДС"
    if (/без\s*ндс/i.test(fullText) && out.isWithVat == null) out.isWithVat = false;
    if (/(в\s*т\.?\s*ч\.?\s*ндс|сумма\s*ндс|ндс[:,]?)/i.test(fullText) && out.isWithVat == null) out.isWithVat = true;

    // Итог: если явного amount нет, но есть amountWithVat — подставим
    if (out.amount == null && out.amountWithVat != null) out.amount = out.amountWithVat;

    return out;
}