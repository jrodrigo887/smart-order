export type FielErrors = {
  [field: string]: string[] | undefined;
};

export interface ValidatorFieldInterface<T> {
  errors: FielErrors | null;
  validatedData: T | null;
  validate: (value: any) => boolean;
}
