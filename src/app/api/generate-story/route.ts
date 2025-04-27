import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
});

export async function POST(req: Request) {
  try {
    const { childName, favoriteAnimal, lesson, specialElement } = await req.json();

    const prompt = `다음 정보를 바탕으로 아이를 위한 짧고 재미있는 이야기를 만들어 주세요.

    아이 이름: ${childName}
    좋아하는 동물: ${favoriteAnimal || "상상 속의 동물"}
    배우고 싶은 교훈: ${lesson || "착한 마음"}
    특별한 요소: ${specialElement || "신기한 마법"}

    이야기는 ${childName}이(가) ${favoriteAnimal || "신비한 친구"}와 함께 ${lesson ? lesson : ""}을 배우는 ${specialElement ? specialElement : ""}에 대한 내용으로 구성해 주세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const story = completion.choices[0]?.message?.content;

    if (story) {
      return NextResponse.json({ story });
    } else {
      return NextResponse.json({ error: '이야기를 생성하지 못했습니다.' }, { status: 500 });
    }
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    return NextResponse.json({ error: 'OpenAI API 호출 중 오류가 발생했습니다.' }, { status: 500 });
  }
}