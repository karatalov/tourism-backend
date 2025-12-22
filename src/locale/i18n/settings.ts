import ru from "./ru.json";
import en from "./en.json";
import ky from "./ky.json";

export type Lang = "ru" | "en" | "ky";

const messages: Record<Lang, Record<string, string>> = {
  ru,
  en,
  ky,
};

export function t(key: string, lang: Lang = "ru") {
  return messages[lang]?.[key] ?? messages.ru[key] ?? key;
}
