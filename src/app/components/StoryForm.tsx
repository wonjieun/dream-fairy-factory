// app/components/StoryForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StoryFormProps {
  onGenerateStory: (formData: {
    childName: string;
    favoriteAnimal: string;
    lesson: string;
    specialElement: string;
  }) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ onGenerateStory }) => {
  const [childName, setChildName] = useState('');
  const [favoriteAnimal, setFavoriteAnimal] = useState('');
  const [lesson, setLesson] = useState('');
  const [specialElement, setSpecialElement] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerateStory({ childName, favoriteAnimal, lesson, specialElement });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
          아이 이름
        </label>
        <Input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="예: 지우"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="favoriteAnimal" className="block text-sm font-medium text-gray-700">
          가장 좋아하는 동물 (선택)
        </label>
        <Input
          id="favoriteAnimal"
          type="text"
          value={favoriteAnimal}
          onChange={(e) => setFavoriteAnimal(e.target.value)}
          placeholder="예: 귀여운 강아지"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="lesson" className="block text-sm font-medium text-gray-700">
          배우고 싶은 교훈 (선택)
        </label>
        <Input
          id="lesson"
          type="text"
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="예: 용기와 우정"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="specialElement" className="block text-sm font-medium text-gray-700">
          이야기에 넣고 싶은 특별한 요소 (선택)
        </label>
        <Input
          id="specialElement"
          type="text"
          value={specialElement}
          onChange={(e) => setSpecialElement(e.target.value)}
          placeholder="예: 하늘을 나는 자동차"
          className="mt-1"
        />
      </div>
      <Button type="submit">이야기 만들기</Button>
    </form>
  );
};

export default StoryForm;