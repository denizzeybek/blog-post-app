import type { Language } from "@/plugins/i18n";

export interface ILanguageOption {
  name: string;
  value: Language;
}
export const languageOptions: ILanguageOption[] = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "Türkçe",
    value: "tr",
  },
];
