import { colorSpaceValues, Color } from '../definitions/tokenTypes.js';

interface NamedRange {
  [key: string]: [number, number];
}

interface ColorValues {
  [key: string]: number;
}

const CSS_VALUE_RANGES = {
  fontWeight: [0, 1000],
  cubicBezierX: [0, 1],
  gradientPosition: [0, 1],
} as const;

const COLOR_RANGES: Record<Color.RawValue['colorSpace'], NamedRange> = {
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

function checkCssPropertyRange(
  value: number,
  rangeName: keyof typeof CSS_VALUE_RANGES,
): boolean {
  const range = CSS_VALUE_RANGES[rangeName];
  if (!range) {
    throw new Error(`Range "${rangeName}" is not defined.`);
  }
  return value >= range[0] && value <= range[1];
}

function checkColorComponentRange(
  colorSpace: keyof typeof COLOR_RANGES,
  values: ColorValues,
) {
  const colorRange = COLOR_RANGES[colorSpace];
  if (!colorRange) {
    throw new Error(`Color space "${colorSpace}" is not defined.`);
  }
  for (const [component, componentValue] of Object.entries(values)) {
    const componentRange = colorRange[component];
    if (!componentRange) {
      throw new Error(
        `Component "${component}" is not defined for color space "${colorSpace}".`,
      );
    }
    if (
      componentValue < componentRange[0] ||
      componentValue >= componentRange[1]
    ) {
      return false;
    }
  }
  return true;
}

export function isInRange(
  value: number,
  range:
    | keyof typeof CSS_VALUE_RANGES
    | { colorSpace: (typeof colorSpaceValues)[number]; values: ColorValues },
): boolean {
  if (typeof range === 'string') {
    return checkCssPropertyRange(value, range);
  } else {
    return checkColorComponentRange(range.colorSpace, range.values);
  }
}
