import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StoryFormProps {
  childName: string;
  favoriteAnimal: string;
  lesson: string;
  specialElement: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({
  childName,
  favoriteAnimal,
  lesson,
  specialElement,
  onChange,
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="childName">아이 이름</Label>
          <Input id="childName" name="childName" value={childName} onChange={onChange} />
        </div>
        <div>
          <Label htmlFor="favoriteAnimal">가장 좋아하는 동물</Label>
          <Input id="favoriteAnimal" name="favoriteAnimal" value={favoriteAnimal} onChange={onChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="lesson">배우고 싶은 교훈</Label>
        <Input id="lesson" name="lesson" value={lesson} onChange={onChange} />
      </div>
      <div>
        <Label htmlFor="specialElement">이야기에 넣고 싶은 특별한 요소 (선택 사항)</Label>
        <Input id="specialElement" name="specialElement" value={specialElement} onChange={onChange} />
      </div>
    </div>
  );
};

export default StoryForm;