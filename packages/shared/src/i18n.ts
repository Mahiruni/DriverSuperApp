export const supportedLocales=['en','am','om','ti'] as const;
export type Locale=typeof supportedLocales[number];
export const defaultLocale:Locale='en';
export function getLocale(value:string|undefined):Locale{return supportedLocales.includes(value as Locale)?value as Locale:defaultLocale;}
