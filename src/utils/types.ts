export const UTILS_ERRORS = [
  'TYPE_ERROR',
  'FORMAT_ERROR',
  'OUT_OF_RANGE',
  'UNDEFINED_COMPONENT',
  'UNDEFINED_RANGE',
  'UNDEFINED_COLOR_SPACE',
] as const;

export type ValidationError = {
  tag: (typeof UTILS_ERRORS)[number];
  message: string;
};

export type Result<T, E> =
  | {
      status: 'ok';
      value: T;
    }
  | {
      status: 'error';
      error: E;
    };
