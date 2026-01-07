import { Color } from '../definitions/tokenTypes.js';
import { Result, ValidationError } from './types.js';

interface NamedRanges {
  [key: string]: [number, number];
}

interface ColorValues {
  [key: string]: number;
}

export const CSS_VALUES_RANGES = {
  fontWeight: [0, 1000],
  cubicBezierX: [0, 1],
  gradientPosition: [0, 1],
} as const;

export const COLOR_SPACES_RANGES: Record<
  Color.RawValue['colorSpace'],
  NamedRanges
> = {
  srgb: {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  'srgb-linear': {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  hsl: {
    h: [0, 360],
    s: [0, 1],
    l: [0, 1],
  },
  hwb: {
    h: [0, 360],
    w: [0, 1],
    b: [0, 1],
  },
  lab: {
    l: [0, 100],
    a: [-Infinity, Infinity],
    b: [-Infinity, Infinity],
  },
  lch: {
    l: [0, 100],
    c: [0, Infinity],
    h: [0, 360],
  },
  oklab: {
    l: [0, 1],
    a: [-Infinity, Infinity],
    b: [-Infinity, Infinity],
  },
  oklch: {
    l: [0, 1],
    c: [0, Infinity],
    h: [0, 360],
  },
  'display-p3': {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  'a98-rgb': {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  'prophoto-rgb': {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  rec2020: {
    r: [0, 1],
    g: [0, 1],
    b: [0, 1],
  },
  'xyz-d65': {
    x: [0, 1],
    y: [0, 1],
    z: [0, 1],
  },
  'xyz-d50': {
    x: [0, 1],
    y: [0, 1],
    z: [0, 1],
  },
} as const;

const EXTREMA_EXCLUDED: Partial<
  Record<Color.RawValue['colorSpace'], { key: string; index: number }[]>
> = {
  hsl: [{ key: 'h', index: 1 }],
  hwb: [{ key: 'h', index: 1 }],
  lch: [{ key: 'h', index: 1 }],
  oklch: [{ key: 'h', index: 1 }],
};

export function isInRangeCSS(
  value: number,
  rangeName: keyof typeof CSS_VALUES_RANGES,
): Result<true, ValidationError> {
  if (typeof value !== 'number') {
    return {
      status: 'error',
      error: {
        tag: 'TYPE_ERROR',
        message: `Expected a number. Got "${typeof value}".`,
      },
    };
  }

  const range = CSS_VALUES_RANGES[rangeName];

  if (!range) {
    return {
      status: 'error',
      error: {
        tag: 'UNDEFINED_RANGE',
        message: `Range for property "${rangeName}" is not defined.`,
      },
    };
  }
  const isOk = value >= range[0] && value <= range[1];

  if (!isOk) {
    return {
      status: 'error',
      error: {
        tag: 'OUT_OF_RANGE',
        message: `Value ${value} is out of range [${range[0]}, ${range[1]}] for property "${rangeName}".`,
      },
    };
  }

  return { status: 'ok', value: true };
}

export function isInRangeColorSpace(
  colorSpace: keyof typeof COLOR_SPACES_RANGES,
  values: ColorValues,
): Result<true, ValidationError> {
  const colorRange = COLOR_SPACES_RANGES[colorSpace];
  if (!colorRange) {
    return {
      status: 'error',
      error: {
        tag: 'UNDEFINED_COLOR_SPACE',
        message: `Color space "${colorSpace}" is not defined.`,
      },
    };
  }

  for (const [component, componentValue] of Object.entries(values)) {
    if (typeof componentValue !== 'number') {
      return {
        status: 'error',
        error: {
          tag: 'TYPE_ERROR',
          message: `Expected a number for component "${component}". Got "${typeof componentValue}".`,
        },
      };
    }

    const componentRange = colorRange[component];
    if (!componentRange) {
      return {
        status: 'error',
        error: {
          tag: 'UNDEFINED_COMPONENT',
          message: `Component "${component}" is not defined for color space "${colorSpace}".`,
        },
      };
    }

    const extremaExclusions = EXTREMA_EXCLUDED[colorSpace];
    if (extremaExclusions) {
      const exclusion = extremaExclusions.find(
        (excl) => excl.key === component,
      );
      if (exclusion) {
        if (
          (exclusion.index === 0 && componentValue === componentRange[0]) ||
          (exclusion.index === 1 && componentValue === componentRange[1])
        ) {
          return {
            status: 'error',
            error: {
              tag: 'OUT_OF_RANGE',
              message: `Value ${componentValue} for component "${component}" is out of range [${componentRange[0]}, ${componentRange[1]}] for color space "${colorSpace}". Range index ${exclusion.index} excludes extrema.`,
            },
          };
        }
      }
    }

    if (
      componentValue < componentRange[0] ||
      componentValue > componentRange[1]
    ) {
      return {
        status: 'error',
        error: {
          tag: 'OUT_OF_RANGE',
          message: `Value ${componentValue} for component "${component}" is out of range [${componentRange[0]}, ${componentRange[1]}] for color space "${colorSpace}".`,
        },
      };
    }
  }

  return { status: 'ok', value: true };
}
