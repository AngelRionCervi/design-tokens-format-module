import { describe, it, expect } from 'vitest';
import {
  isInRangeCSS,
  isInRangeColorSpace,
} from '../../src/utils/isInRange.js';

describe.concurrent('isInRange CSS properties', () => {
  it('should return ok if the value is within the CSS fontWeight range', () => {
    const result = isInRangeCSS(500, 'fontWeight');
    expect(result).toEqual({ status: 'ok', value: true });
  });

  it('should return ok if the value is within the CSS cubicBezierX range', () => {
    const result = isInRangeCSS(0.5, 'cubicBezierX');
    expect(result).toEqual({ status: 'ok', value: true });
  });

  it('should return error if the value is out of the CSS fontWeight range', () => {
    const result = isInRangeCSS(1500, 'fontWeight');
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'OUT_OF_RANGE',
        message:
          'Value 1500 is out of range [0, 1000] for property "fontWeight".',
      },
    });
  });

  it('should return error if the value is out of the CSS cubicBezierX range', () => {
    const result = isInRangeCSS(1.5, 'cubicBezierX');
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'OUT_OF_RANGE',
        message:
          'Value 1.5 is out of range [0, 1] for property "cubicBezierX".',
      },
    });
  });

  it('should return an error if the value is not a number', () => {
    const result = isInRangeCSS('invalid' as any, 'fontWeight');
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'TYPE_ERROR',
        message: 'Expected a number. Got "string".',
      },
    });
  });
});

describe.concurrent('isInRange Color components', () => {
  it('should return ok if the color component values are within the srgb range', () => {
    const result = isInRangeColorSpace('srgb', { r: 0.03, g: 0.17, b: 0.35 });
    expect(result).toEqual({ status: 'ok', value: true });
  });

  it('should return ok if the color component values are within the hsl range, excluding hue extrema', () => {
    const result = isInRangeColorSpace('hsl', { h: 0, s: 0, l: 1 });
    expect(result).toEqual({ status: 'ok', value: true });
  });

  it('should return ok if the color component values are within the hsl range, excluding hue extrema', () => {
    const result = isInRangeColorSpace('oklch', { l: 0.6, c: 0.24, h: 27 });
    expect(result).toEqual({ status: 'ok', value: true });
  });

  it('should return error if a color component value is out of the hsl range', () => {
    const result = isInRangeColorSpace('lch', { l: 50, c: 30, h: 360 });
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'OUT_OF_RANGE',
        message:
          'Value 360 for component "h" is out of range [0, 360] for color space "lch". Range index 1 excludes extrema.',
      },
    });
  });

  it('should return error if a color component value is out of the srgb range', () => {
    const result = isInRangeColorSpace('srgb', { r: 1, g: 1.5, b: 0 });
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'OUT_OF_RANGE',
        message:
          'Value 1.5 for component "g" is out of range [0, 1] for color space "srgb".',
      },
    });
  });

  it('should return error if the color space is undefined', () => {
    const result = isInRangeColorSpace('unknown' as any, { r: 0, g: 0, b: 0 });
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'UNDEFINED_COLOR_SPACE',
        message: 'Color space "unknown" is not defined.',
      },
    });
  });

  it('should return an error id the component range is undefined', () => {
    const result = isInRangeColorSpace('srgb', {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    } as any);
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'UNDEFINED_COMPONENT',
        message: 'Component "a" is not defined for color space "srgb".',
      },
    });
  });

  it('should return an error if the color component value is not a number', () => {
    const result = isInRangeColorSpace('display-p3', {
      r: 0,
      g: 'invalid' as any,
      b: 0,
    });
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'TYPE_ERROR',
        message: 'Expected a number for component "g". Got "string".',
      },
    });
  });

  it('should return an error if the color space is undefined', () => {
    const result = isInRangeColorSpace('unknown' as any, { r: 0, g: 0, b: 0 });
    expect(result).toEqual({
      status: 'error',
      error: {
        tag: 'UNDEFINED_COLOR_SPACE',
        message: 'Color space "unknown" is not defined.',
      },
    });
  });
});
