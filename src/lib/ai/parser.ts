// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export interface ParsedFile {
  filename: string;
  fileType: string;
  textContent: string;
}

export async function parseAttachmentToText(
  filename: string,
  fileType: string,
  fileData: string // base64 data URL
): Promise<ParsedFile> {
  const parts = fileData.split(";base64,");
  const base64Str = parts.length > 1 ? parts[1] : parts[0];
  const buffer = Buffer.from(base64Str, "base64");

  let textContent = "";

  try {
    if (fileType === "application/pdf" || filename.toLowerCase().endsWith(".pdf")) {
      const parsed = await pdfParse(buffer);
      textContent = parsed.text || "";
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      filename.toLowerCase().endsWith(".docx")
    ) {
      const parsed = await mammoth.extractRawText({ buffer });
      textContent = parsed.value || "";
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel" ||
      filename.toLowerCase().endsWith(".xlsx") ||
      filename.toLowerCase().endsWith(".xls")
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      let excelText = "";
      for (const sheetName of workbook.SheetNames) {
        excelText += `--- Sheet: ${sheetName} ---\n`;
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        excelText += csv + "\n\n";
      }
      textContent = excelText;
    } else if (
      fileType.startsWith("text/") ||
      filename.toLowerCase().endsWith(".txt") ||
      filename.toLowerCase().endsWith(".csv") ||
      filename.toLowerCase().endsWith(".md")
    ) {
      textContent = buffer.toString("utf-8");
    } else {
      // Fallback: try to extract text from generic file using basic buffer-to-string
      textContent = `[Binary file: ${filename} (type: ${fileType}). Cannot preview content directly.]`;
    }
  } catch (error) {
    console.error(`Error parsing file ${filename}:`, error);
    textContent = `[Error parsing file ${filename}: ${error instanceof Error ? error.message : String(error)}]`;
  }

  return {
    filename,
    fileType,
    textContent: textContent.trim(),
  };
}
