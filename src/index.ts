export {
  type AliasValue,
  type WithAliasValue,
  ALIAS_PATH_SEPARATOR,
} from './definitions/Alias.js';
export { type GroupProperties } from './definitions/GroupProperties.js';
export { type Json } from './definitions/JSONSignatures.js';
export { type JSONTokenTree } from './definitions/JSONTokenTree.js';
export { type TokenSignature } from './definitions/TokenSignature.js';
export {
  type Color,
  type Dimension,
  type FontFamily,
  type FontWeight,
  type Duration,
  type CubicBezier,
  type Number,
  type StrokeStyle,
  type Border,
  type Transition,
  type Shadow,
  type Gradient,
  type Typography,
  // Aggregated types
  type DesignToken,
  type TokenTypeName,
  // Utils
  type PickTokenByType,
  // Types constants
  tokenTypeNames,
  tokenTypeNamesMapping,
  // Enum-like values
  colorSpaceValues,
  fontWeightValues,
  strokeStyleStringValues,
  strokeStyleLineCapValues,
} from './definitions/tokenTypes.js';

export { captureAliasPath } from './utils/captureAliasPath.js';
export { CAPTURE_ALIAS_PATH_ERRORS } from './utils/types.js';
export {
  COLOR_SPACES_RANGES,
  CSS_VALUES_RANGES,
  isInRange,
} from './utils/isInRange.js';
export {
  extractAliasPathAsString,
  extractAliasPathAsArray,
} from './utils/extractAliasPath.js';
export { matchIsAliasValue } from './utils/matchIsAliasValue.js';
export { matchIsGroup } from './utils/matchIsGroup.js';
export { matchIsToken } from './utils/matchIsToken.js';
export { matchIsTokenTypeName } from './utils/matchIsTokenTypeName.js';
