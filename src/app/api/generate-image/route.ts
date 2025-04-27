import { NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: '이미지 생성을 위한 프롬프트가 필요합니다.' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      }
    });
    
    let result = '';
    if (!response?.candidates?.[0]?.content?.parts) {
      return NextResponse.json({ error: '응답 형식이 잘못되었습니다.' }, { status: 500 });
    }
    for (const part of response?.candidates?.[0]?.content?.parts) {
      if (part.inlineData) {
        result = part.inlineData.data ?? "";
      }
    }
    return NextResponse.json({ imageUrl: result }, { status: 200 });
  } catch (error: unknown) {
    console.error('Gemini API 이미지 생성 오류:', error);
    return NextResponse.json({ error: 'Gemini API 호출 중 오류 발생' }, { status: 500 });
  }
}