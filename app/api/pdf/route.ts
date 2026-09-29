import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "没有收到 PDF 文件" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const parser = new PDFParse({
      data: arrayBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return Response.json({
      text: result.text,
    });
  } catch (error) {
    console.error("PDF 解析失败，详细错误：", error);

    return Response.json(
      { error: "PDF 解析失败" },
      { status: 500 }
    );
  }
}