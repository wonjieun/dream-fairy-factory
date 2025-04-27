'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import StoryForm from './StoryForm';

interface StoryInputs {
  childName: string;
  favoriteAnimal: string;
  lesson: string;
  specialElement: string;
}

const defaultInputs: StoryInputs = {
  childName: '',
  favoriteAnimal: '',
  lesson: '',
  specialElement: '',
};

const imageStyles = [
  { value: '수채화', label: '수채화' },
  { value: '유화', label: '유화' },
  { value: '파스텔', label: '파스텔' },
  { value: '애니메이션', label: '애니메이션' },
  { value: '스케치', label: '스케치' },
  { value: '3D 렌더링', label: '3D 렌더링' },
];

export default function StoryGenerator() {
  const [inputs, setInputs] = useState<StoryInputs>(defaultInputs);
  const [story, setStory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>("수채화");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleStyleSelect = (value: string) => {
    setSelectedStyle(value);
  };

  const generateStoryAndImage = async () => {
    setLoadingStory(true);
    setError(null);
    setGeneratedImageUrl(null);
    setSelectedStyle("수채화");

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      const storyData = await response.json();
      if (storyData?.story) {
        setStory(storyData.story);
      } else {
        setError('이야지 생성에 실패했습니다.');
      }
    } catch (err: unknown) {
      console.error('이야기 생성 오류:', err);
      setError('이야지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoadingStory(false);
    }
  };

  const generateImage = async () => {
    if (!story) {
      setError('먼저 이야기를 생성해 주세요.');
      return;
    }

    setLoadingImage(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const prompt = `다음 이야기를 ${selectedStyle} 스타일로 묘사하는 그림을 생성해 주세요. 그림에는 등장인물, 배경, 주요 장면 등 시각적인 요소만 포함하고, 어떠한 글자나 텍스트도 포함하지 마세요. 이야기: "${story}"`;

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const imageData = await response.json();
      if (imageData?.imageUrl) {
        setGeneratedImageUrl(`data:image/png;base64,${imageData.imageUrl}`)
      } else {
        setError('이미지 생성에 실패했습니다.');
      }
    } catch (err: unknown) {
      console.error('이미지 생성 오류:', err);
      setError('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>꿈꾸는 동화 만들기</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <StoryForm
            childName={inputs.childName}
            favoriteAnimal={inputs.favoriteAnimal}
            lesson={inputs.lesson}
            specialElement={inputs.specialElement}
            onChange={handleInputChange}
          />
          <div>
            <Button onClick={generateStoryAndImage} disabled={loadingStory}>
              {loadingStory ? '이야기 생성 중...' : '이야기 만들어줘!'}
            </Button>
          </div>
          {story && (
            <div className="mt-6">
              <h3>생성된 이야기</h3>
              <Card className="bg-muted">
                <CardContent>
                  <Textarea value={story} readOnly className="resize-none" />
                </CardContent>
              </Card>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <Label htmlFor="imageStyle">그림 스타일 선택</Label>
                  <Select onValueChange={handleStyleSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="수채화" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button onClick={generateImage} disabled={loadingImage || !story}>
                    {loadingImage ? '그림 생성 중...' : '이야기에 그림 추가해줘!'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {generatedImageUrl && (
            <div className="mt-6">
              <h3>생성된 그림</h3>
              <Card className="bg-muted">
                <CardContent className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <Image src={generatedImageUrl} alt="생성된 동화 이미지" fill style={{ objectFit: 'contain' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}