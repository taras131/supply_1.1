import {pdfjs} from "react-pdf";

export const readText = async (
    file: File,
    setPaymentErrorMessage: (message: string) => void
): Promise<string> => {
    try {
        const fileBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
            data: fileBuffer,
            cMapUrl: "/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "/standard_fonts/",
            enableXfa: true,
        });
        const pdf = await loadingTask.promise;
        console.log(pdf)
        const totalPages = pdf.numPages;
        let fullText = "";
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = (content.items as any[])
                .map((item) => item.str)
                .join(" ");
            fullText += pageText + " ";
        }
        return fullText.trim();
    } catch (error) {
        setPaymentErrorMessage("Ошибка чтения файла");
        return "";
    }
};