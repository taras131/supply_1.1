import mammoth from "mammoth";
import { parseCommonFieldsFromText, ParsedInvoice } from "./invoiceParsers";
// PDF — используй твой readText(file, ...) и передавай текст сюда
export async function parsePdfInvoiceText(text: string): Promise<ParsedInvoice> {
    return parseCommonFieldsFromText(text);
}
// Excel (.xlsx/.xls)

// Word (.docx)
export async function parseDocxInvoice(file: File): Promise<ParsedInvoice> {
    const buf = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return parseCommonFieldsFromText(value || "");
}