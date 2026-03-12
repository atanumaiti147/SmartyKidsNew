'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings } from '@/lib/settings/settings-context';

export default function Settings() {
  const { 
    language, 
    setLanguage,
    dict 
  } = useSettings();

  const handleLanguageChange = (value: 'en' | 'hi' | 'bn') => {
    setLanguage(value);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
         <h3 className="text-lg font-medium">Localization</h3>
        <Label htmlFor="language-select">{dict.settings.languageLabel}</Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger id="language-select" className="w-full">
            <SelectValue placeholder={dict.settings.languagePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{dict.settings.english}</SelectItem>
            <SelectItem value="hi">{dict.settings.hindi}</SelectItem>
            <SelectItem value="bn">{dict.settings.bengali}</SelectItem>
          </SelectContent>
        </Select>
          <p className="text-sm text-muted-foreground">{dict.settings.translationNotice}</p>
      </div>
    </div>
  );
}
