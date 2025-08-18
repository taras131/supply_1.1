import { useState } from "react";
import { pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
// Установка пути к рабочему потоку
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const validationFile = (file: File): boolean => {
  return file && file.name.split(".").pop() === "pdf";
};
const readText = async (file: File, setPaymentErrorMessage: (message: string) => void): Promise<string> => {
  try {
    const fileBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
    const pdf = await pdfjs.getDocument({ data: fileBuffer }).promise; // Load PDF from ArrayBuffer
    const totalPages = pdf.numPages;
    let fullText = "";
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + " ";
    }
    return fullText.trim();
  } catch (error) {
    setPaymentErrorMessage("Ошибка чтения файла");
    return "";
  }
};
const checkPayment = (text: string): boolean => {
  let isPaymentOrder = false;
  const textArr = text.split(" ");
  for (let i = 0; i < textArr.length - 1; i++) {
    if (textArr[i] === "ПЛАТЕЖНОЕ" && textArr[i + 1] === "ПОРУЧЕНИЕ") {
      isPaymentOrder = true;
    }
  }
  return isPaymentOrder;
};
const readAmount = (text: string): number => {
  let amount = 0;
  const textArr = text.split(" ");
  for (let i = 0; i < textArr.length - 1; i++) {
    if (textArr[i] === "Сумма") {
      amount = +textArr[i + 1].split("-").join(".");
    }
  }
  return amount;
};
export const useUploadFile = () => {
  const [file, setFile] = useState<null | File>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const onFileChange = async (event: any) => {
    setIsLoading(true);
    setAmount(0);
    setPaymentErrorMessage("");
    const file = event.target.files[0];
    if (file) {
      const fileIsValid = validationFile(file);
      if (!fileIsValid) {
        setPaymentErrorMessage("Не является pdf файлом.");
      } else {
        const text = await readText(file, setPaymentErrorMessage);
        if (!text) {
          setPaymentErrorMessage("Не удаётся прочитать pdf файл");
        } else {
          const isPayment = checkPayment(text);
          if (!isPayment) {
            setPaymentErrorMessage("Не является платёжным поручением.");
          } else {
            const amount = readAmount(text);
            if (amount) {
              setAmount(amount);
            } else {
              setPaymentErrorMessage("Не удалось распознать сумму.");
            }
          }
        }
      }
      setFile(file);
      setIsLoading(false);
    }
  };
  return { onFileChange, setIsLoading, paymentErrorMessage, amount, isLoading, file };
};
