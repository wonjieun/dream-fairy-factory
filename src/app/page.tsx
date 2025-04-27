// app/page.tsx
'use client';

import StoryForm from './components/StoryForm';
import { useState } from 'react';

export default function Home() {
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStory = async (formData: {
    childName: string;
    favoriteAnimal: string;
    lesson: string;
    specialElement: string;
  }) => {
    setIsLoading(true);
    setGeneratedStory(null); // 이전 이야기 초기화

    try {
      // Open AI API 호출 (API 키는 환경 변수로 관리하는 것이 좋습니다.)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Open AI API Error:', errorData);
        setGeneratedStory('이야기를 생성하는 데 실패했습니다.');
      } else {
        const data = await response.json();
        setGeneratedStory(data.story);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setGeneratedStory('이야기를 생성하는 동안 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">꿈꾸는 동화 공장</h1>
      <StoryForm onGenerateStory={handleGenerateStory} />

      {isLoading && <p className="mt-4">이야기를 만들고 있어요... ⏳</p>}
      {generatedStory && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">짠! 당신의 이야기가 완성됐어요!</h2>
          <p>{generatedStory}</p>
        </div>
      )}
    </div>
  );
}