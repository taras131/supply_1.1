export type ParsedInvoice = {
    number?: string | null;
    numberDate?: string | null;      // дата из “от …”
    supplierInn?: string | null;
    isWithVat?: boolean | null;
    vatPercent?: number | null;
    amount?: number | null;          // Итого/Всего к оплате
    amountWithVat?: number | null;   // Итого с НДС (если отдельно)
    raw?: string;                    // сырой нормализованный текст
};
// Нормализация текста: убираем NBSP, схлопываем пробелы
const norm = (s: string) =>
    s.replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
const moneyToNumber = (s: string) => {
    // допускаем "98 740,64" / "98740.64"
    const t = s.replace(/\s/g, "").replace(",", ".");
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
};
// Базовые паттерны
const INN_RE = /\b(\d{10}|\d{12})\b/;
const VAT_LINE = /(в\s*т\.?\s*ч\.?\s*ндс|сумма\s+ндс|ндс[:,]?)/i;
const VAT_PERCENT_IN_LINE = /(\d{1,2})\s*%/i;
// Номер счёта (с датой). Поддерживает:
// - Счет №Ф 24266/1 от 28.08.25
// - Счет на оплату № Ru00-012305 от 02.06.2025
// - Счет-договор № 123/45 от 12.05.2024
export const NUMBER_WITH_DATE =
    /(Сч[её]т(?:[-\s]?договор)?(?:\s*на\s*оплату)?)\s*(?:№|N[º°o]?|No\.?)\s*([A-Za-zА-Яа-я0-9/_-]+(?:\s+[A-Za-zА-Яа-я0-9/_-]+)*)\s*(?:от\s*([0-3]?\d(?:\.\d{2}\.\d{4}|[.\s][А-Яа-я\w]+\.?\s*\d{4})))?/iu;
// Номер счёта без даты: останавливаемся перед "от" или концом
export const NUMBER_LINE =
    /(Сч[её]т(?:[-\s]?договор)?(?:\s*на\s*оплату)?)\s*(?:№|N[º°o]?|No\.?)\s*([A-Za-zА-Яа-я0-9/_-]+(?:\s+[A-Za-zА-Яа-я0-9/_-]+)*)(?=\s*(?:от\b|$))/iu;
// Суммы
const TOTAL_WITH_VAT_LINE =
    /(Итого\s*с\s*НДС)[:\s]*([0-9\s.,]+)\b/i;
const TOTAL_LINE =
    /(Итого(?:\s*с\s*НДС)?|Всего\s*к\s*оплате|Итого\s*к\s*оплате|Итого\s*с\s*НДС)[:\s]*([0-9\s.,]+)\b/i;
// Строка НДС со значением и, опционально, процентом
const TOTAL_VAT_SUM_LINE =
    /(Сумма\s*НДС|В\s*т\.?\s*ч\.?\s*НДС)(?:\s*$\s*(\d{1,2})\s*%\s*$)?[:\s]*([0-9\s.,]+)\b/i;
// Основной парсер
export function parseCommonFieldsFromText(rawText: string): ParsedInvoice {
    const text = norm(rawText);
    const out: ParsedInvoice = { raw: text };
    // Номер счета и дата: сначала пробуем с датой, потом — без
    let num = NUMBER_WITH_DATE.exec(text);
    if (num) {
        out.number = num[2]?.replace(/\s{2,}/g, " ").trim() ?? null;
        out.numberDate = num[3]?.trim() ?? null;
    } else {
        const m = NUMBER_LINE.exec(text);
        if (m) {
            out.number = m[2]?.replace(/\s{2,}/g, " ").trim() ?? null;
        }
    }
    // ИНН поставщика — эвристика:
    // 1) ближайший блок к "Поставщик"
    // 2) либо "Банк получателя"
    // 3) либо верхний кусок документа
    const supBlock =
        /Поставщик[^\S\r\n]*:?[^\n]{0,200}/i.exec(text)?.[0] ||
        /Банк\s+получателя[^\n]{0,300}/i.exec(text)?.[0] ||
        text.slice(0, 1500);
    const innNear =
        /ИНН\D{0,12}(\d{10,12})/i.exec(supBlock) || INN_RE.exec(supBlock);
    if (innNear) out.supplierInn = innNear[1];
    // НДС: наличие и процент
    if (/без\s*ндс/i.test(text)) {
        out.isWithVat = false;
    } else {
        const vline = text.match(VAT_LINE);
        if (vline) {
            out.isWithVat = true;
            const pct = vline[0].match(VAT_PERCENT_IN_LINE);
            if (pct) out.vatPercent = Number(pct[1]);
        }
    }
    // Суммы
    const totalWithVat = text.match(TOTAL_WITH_VAT_LINE);
    if (totalWithVat) {
        out.amountWithVat = moneyToNumber(totalWithVat[2]);
    }
    const totalLine = text.match(TOTAL_LINE);
    if (totalLine) {
        if (/Итого\s*с\s*НДС/i.test(totalLine[1])) {
            out.amountWithVat = moneyToNumber(totalLine[2]);
        } else {
            out.amount = moneyToNumber(totalLine[2]);
        }
    }
    // Строка НДС со значением
    const vatSum = text.match(TOTAL_VAT_SUM_LINE);
    if (vatSum) {
        // Наличие отдельной строки НДС — трактуем как "с НДС"
        if (out.isWithVat !== false) out.isWithVat = true;
        // Процент из скобок, если ранее не нашёлся
        const pct = vatSum[2];
        if (!out.vatPercent && pct) {
            out.vatPercent = Number(pct);
        }
        // Сумму НДС можно при необходимости сохранить отдельно (сейчас не требуется).
        // const vatAmount = moneyToNumber(vatSum[3]);
    }
    // Если amount пуст, а есть amountWithVat — подставим
    if (out.amount == null && out.amountWithVat != null) {
        out.amount = out.amountWithVat;
    }
    return out;
}