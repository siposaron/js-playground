/**
 * This type definition augments existing definition
 * from @types/xlsx-template
 */
declare namespace XlsxTemplate {
  export interface XlsxTemplate {
    substituteAll(substitutions: any): any;
  }
}

interface XlsxTemplateExtended {
  substituteAll(substitutions: any): void;
}

declare module 'xlsx-template-extended';
