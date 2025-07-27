export type DateProvider = () => Date;

export function DefaultDateProvider(): Date {
  return new Date();
}
