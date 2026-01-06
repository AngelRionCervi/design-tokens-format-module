export const CAPTURE_ALIAS_PATH_ERRORS = [
  'TYPE_ERROR',
  'FORMAT_ERROR',
  'OUT_OF_RANGE',
  'UNDEFINED_COMPONENT',
] as const;

export type ValidationError = {
  tag: (typeof CAPTURE_ALIAS_PATH_ERRORS)[number];
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
