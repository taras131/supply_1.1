import {ChangeEvent, useState} from "react";
import {pdfjs} from "react-pdf";
import {readText} from "../utils/readPdfText";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const extractInnsByOrder = (text: string): string[] => {
    const inns = Array.from(text.matchAll(/ИНН\D{0,12}(\d{10,12})/giu)).map(m => m[1]);
    return inns;
};

const isPdfFile = async (file: File): Promise<boolean> => {
    if (!file) return false;
    if (file.type === "application/pdf") return true;
    const name = (file.name || "").toLowerCase();
    if (name.endsWith(".pdf")) return true;
    try {
        const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
        const signature = new TextDecoder("ascii").decode(header);
        if (signature === "%PDF-") return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

const isPaymentOrder = (text: string): boolean => /ПЛАТЕЖНОЕ\s+ПОРУЧЕНИЕ/iu.test(text);

const readAmount = (text: string): number | null => {
    const dashSrc = '[–—−-]'; // en/em‑dash, минус, дефис
    // 1) "Сумма <рубли> — <копейки>" (десятичный разделитель — дефис/тире)
    let m = new RegExp(`Сумма\\s+([\\d\\s]+)\\s*${dashSrc}\\s*(\\d{2})`, 'iu').exec(text);
    if (m) return Number(`${m[1].replace(/\s+/g, '')}.${m[2]}`);

    // 2) "Сумма <рубли>[.,]<копейки>"
    m = /Сумма\s+([\d\s]+)\s*[.,]\s*(\d{2})/iu.exec(text);
    if (m) return Number(`${m[1].replace(/\s+/g, '')}.${m[2]}`);

    // 3) Фоллбек: любое "<рубли> — <копейки>" в тексте
    m = new RegExp(`(\\d[\\d\\s]*)\\s*${dashSrc}\\s*(\\d{2})`, 'iu').exec(text);
    if (m) return Number(`${m[1].replace(/\s+/g, '')}.${m[2]}`);

    return null;
};

type Accounts = { payer: string | null; recipient: string | null; all: string[] };

const extractAccounts = (text: string): Accounts => {
    const reAll = /Сч\.\s*№\s*(\d{20})/gu;
    const all: string[] = [];
    for (let m: RegExpExecArray | null; (m = reAll.exec(text)) !== null;) {
        all.push(m[1]);
    }

    const payerNear = /Плательщик[\s\S]{0,250}?Сч\.\s*№\s*(\d{20})/u.exec(text);
    const recipientNear = /Получатель[\s\S]{0,250}?Сч\.\s*№\s*(\d{20})/u.exec(text);

    let payer: string | null = payerNear?.[1] ?? null;
    let recipient: string | null = recipientNear?.[1] ?? null;

    const settlement = all.filter(a => /^(407|408|423|421)/.test(a));

    if (!payer || !recipient) {
        if (!payer && settlement.length) payer = settlement[0] ?? null;
        if (!recipient && settlement.length) {
            recipient = settlement.find(a => a !== payer) ?? recipient ?? null;
        }
    }

    return {payer, recipient, all};
};


export interface IFileWithAmount {
    file: File;
    amount: number;
    payer?: string;
    recipient?: string;
    recipient_inn: string | null;
    error?: string;
}

export const useUploadPaymentFile = () => {
    const [filesWithAmount, setFilesWithAmount] = useState<IFileWithAmount[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setPaymentErrorMessage('');
        setFilesWithAmount(null);
        const inputEl = e.currentTarget; // сохраним ссылку, если захотите очистить value
        const list = inputEl.files;
        const files = Array.from(list ?? []);
        const tempArr: IFileWithAmount[] = [];
        if (files.length === 0) {
            setIsLoading(false);
            return;
        }
        for (const file of files) {
            const entry: IFileWithAmount = {file, amount: 0, recipient_inn: null};
            const fileIsValid = await isPdfFile(file);
            if (!fileIsValid) {
                entry.error = `Файл ${file.name} не является PDF.`;
                tempArr.push(entry);
                setPaymentErrorMessage(prev => prev || entry.error!);
                continue;
            }
            const text = await readText(file, setPaymentErrorMessage);
            if (!text) {
                entry.error = `Не удаётся прочитать pdf файл: ${file.name}`;
                tempArr.push(entry);
                setPaymentErrorMessage(prev => prev || entry.error!);
                continue;
            }
            if (!isPaymentOrder(text)) {
                entry.error = `Не является платёжным поручением: ${file.name}`;
                tempArr.push(entry);
                setPaymentErrorMessage(prev => prev || entry.error!);
                continue;
            }
            const amt = readAmount(text);
            if (amt == null || Number.isNaN(amt) || amt <= 0) {
                entry.error = `Не удалось распознать сумму: ${file.name}`;
                // amount остаётся 0
                tempArr.push(entry);
                setPaymentErrorMessage(prev => prev || entry.error!);
                continue;
            }
            const accs = extractAccounts(text);
            entry.amount = amt;
            if (accs.payer) entry.payer = accs.payer;
            if (accs.recipient) entry.recipient = accs.recipient;
            const inns = extractInnsByOrder(text);
            (entry as any).recipient_inn = inns[1] ?? null;
            tempArr.push(entry);
        }
        setFilesWithAmount(tempArr);
        setIsLoading(false);
    };
    const resetFiles = () => setFilesWithAmount(null);
    return {
        onFileChange,
        setIsLoading,
        filesWithAmount,
        paymentErrorMessage,
        isLoading,
        resetFiles,
    };
};