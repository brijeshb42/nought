/**
 * MIT License
 *
 * Copyright (c) 2021 SEEK
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Properties, AtRule } from 'csstype';

export type CSSVarFunction =
  | `var(--${string})`
  | `var(--${string}, ${string | number})`;
type Contract = {
  [key: string]: CSSVarFunction | null | Contract;
};
type Primitive = string | boolean | number | null | undefined;
type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : never;
};

declare const simplePseudoMap: {
  readonly ':-moz-any-link': true;
  readonly ':-moz-full-screen': true;
  readonly ':-moz-placeholder': true;
  readonly ':-moz-read-only': true;
  readonly ':-moz-read-write': true;
  readonly ':-ms-fullscreen': true;
  readonly ':-ms-input-placeholder': true;
  readonly ':-webkit-any-link': true;
  readonly ':-webkit-full-screen': true;
  readonly '::-moz-placeholder': true;
  readonly '::-moz-progress-bar': true;
  readonly '::-moz-range-progress': true;
  readonly '::-moz-range-thumb': true;
  readonly '::-moz-range-track': true;
  readonly '::-moz-selection': true;
  readonly '::-ms-backdrop': true;
  readonly '::-ms-browse': true;
  readonly '::-ms-check': true;
  readonly '::-ms-clear': true;
  readonly '::-ms-fill': true;
  readonly '::-ms-fill-lower': true;
  readonly '::-ms-fill-upper': true;
  readonly '::-ms-reveal': true;
  readonly '::-ms-thumb': true;
  readonly '::-ms-ticks-after': true;
  readonly '::-ms-ticks-before': true;
  readonly '::-ms-tooltip': true;
  readonly '::-ms-track': true;
  readonly '::-ms-value': true;
  readonly '::-webkit-backdrop': true;
  readonly '::-webkit-input-placeholder': true;
  readonly '::-webkit-progress-bar': true;
  readonly '::-webkit-progress-inner-value': true;
  readonly '::-webkit-progress-value': true;
  readonly '::-webkit-resizer': true;
  readonly '::-webkit-scrollbar-button': true;
  readonly '::-webkit-scrollbar-corner': true;
  readonly '::-webkit-scrollbar-thumb': true;
  readonly '::-webkit-scrollbar-track-piece': true;
  readonly '::-webkit-scrollbar-track': true;
  readonly '::-webkit-scrollbar': true;
  readonly '::-webkit-slider-runnable-track': true;
  readonly '::-webkit-slider-thumb': true;
  readonly '::after': true;
  readonly '::backdrop': true;
  readonly '::before': true;
  readonly '::cue': true;
  readonly '::first-letter': true;
  readonly '::first-line': true;
  readonly '::grammar-error': true;
  readonly '::placeholder': true;
  readonly '::selection': true;
  readonly '::spelling-error': true;
  readonly ':active': true;
  readonly ':after': true;
  readonly ':any-link': true;
  readonly ':before': true;
  readonly ':blank': true;
  readonly ':checked': true;
  readonly ':default': true;
  readonly ':defined': true;
  readonly ':disabled': true;
  readonly ':empty': true;
  readonly ':enabled': true;
  readonly ':first': true;
  readonly ':first-child': true;
  readonly ':first-letter': true;
  readonly ':first-line': true;
  readonly ':first-of-type': true;
  readonly ':focus': true;
  readonly ':focus-visible': true;
  readonly ':focus-within': true;
  readonly ':fullscreen': true;
  readonly ':hover': true;
  readonly ':in-range': true;
  readonly ':indeterminate': true;
  readonly ':invalid': true;
  readonly ':last-child': true;
  readonly ':last-of-type': true;
  readonly ':left': true;
  readonly ':link': true;
  readonly ':only-child': true;
  readonly ':only-of-type': true;
  readonly ':optional': true;
  readonly ':out-of-range': true;
  readonly ':placeholder-shown': true;
  readonly ':read-only': true;
  readonly ':read-write': true;
  readonly ':required': true;
  readonly ':right': true;
  readonly ':root': true;
  readonly ':scope': true;
  readonly ':target': true;
  readonly ':valid': true;
  readonly ':visited': true;
};
type SimplePseudos = keyof typeof simplePseudoMap;

interface ContainerProperties {
  container?: string;
  containerType?: 'size' | 'inline-size' | (string & {});
  containerName?: string;
}
type CSSTypeProperties = Properties<number | (string & {})> &
  ContainerProperties;
type CSSProperties = {
  [Property in keyof CSSTypeProperties]:
    | CSSTypeProperties[Property]
    | CSSVarFunction
    | Array<CSSVarFunction | CSSTypeProperties[Property]>;
};
interface CSSKeyframes {
  [time: string]: CSSProperties;
}
type CSSPropertiesWithVars = CSSProperties & {
  vars?: {
    [key: string]: string;
  };
};
type PseudoProperties = {
  [key in SimplePseudos]?: CSSPropertiesWithVars;
};
type CSSPropertiesAndPseudos = CSSPropertiesWithVars & PseudoProperties;
type Query<Key extends string, StyleType> = {
  [key in Key]?: {
    [query: string]: Omit<StyleType, Key>;
  };
};
type MediaQueries<StyleType> = Query<'@media', StyleType>;
type FeatureQueries<StyleType> = Query<'@supports', StyleType>;
type ContainerQueries<StyleType> = Query<'@container', StyleType>;
type Layers<StyleType> = Query<'@layer', StyleType>;
interface AllQueries<StyleType>
  extends MediaQueries<StyleType & AllQueries<StyleType>>,
    FeatureQueries<StyleType & AllQueries<StyleType>>,
    ContainerQueries<StyleType & AllQueries<StyleType>>,
    Layers<StyleType & AllQueries<StyleType>> {}
type WithQueries<StyleType> = StyleType & AllQueries<StyleType>;
interface SelectorMap {
  [selector: string]: CSSPropertiesWithVars &
    WithQueries<CSSPropertiesWithVars>;
}
interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}
type StyleRule = StyleWithSelectors & WithQueries<StyleWithSelectors>;
type GlobalStyleRule = CSSPropertiesWithVars &
  WithQueries<CSSPropertiesWithVars>;
type GlobalFontFaceRule = Omit<AtRule.FontFaceFallback, 'src'> &
  Required<Pick<AtRule.FontFaceFallback, 'src'>>;
type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;
type CSSStyleBlock = {
  type: 'local';
  selector: string;
  rule: StyleRule;
};
type CSSFontFaceBlock = {
  type: 'fontFace';
  rule: GlobalFontFaceRule;
};
type CSSKeyframesBlock = {
  type: 'keyframes';
  name: string;
  rule: CSSKeyframes;
};
type CSSSelectorBlock = {
  type: 'selector' | 'global';
  selector: string;
  rule: GlobalStyleRule;
};
type CSSLayerDeclaration = {
  type: 'layer';
  name: string;
};
type CSS =
  | CSSStyleBlock
  | CSSFontFaceBlock
  | CSSKeyframesBlock
  | CSSSelectorBlock
  | CSSLayerDeclaration;
type FileScope = {
  packageName?: string;
  filePath: string;
};
interface Composition {
  identifier: string;
  classList: string;
}
type CustomIdentFunction = (params: {
  hash: string;
  filePath: string;
  debugId?: string;
  packageName?: string;
}) => string;
type IdentOption = 'short' | 'debug' | CustomIdentFunction;
interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string, fileScope: FileScope) => void;
  registerComposition: (composition: Composition, fileScope: FileScope) => void;
  markCompositionUsed: (identifier: string) => void;
  onBeginFileScope?: (fileScope: FileScope) => void;
  onEndFileScope: (fileScope: FileScope) => void;
  getIdentOption: () => IdentOption;
}
type NullableTokens = {
  [key: string]: string | NullableTokens | null;
};
type Tokens = {
  [key: string]: string | Tokens;
};
type ThemeVars<ThemeContract extends NullableTokens> = MapLeafNodes<
  ThemeContract,
  CSSVarFunction
>;
export type ClassNames = string | Array<ClassNames>;
type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;

interface GenerateIdentifierOptions {
  debugId?: string;
  debugFileName?: boolean;
}
declare function generateIdentifier(debugId?: string): string;
declare function generateIdentifier(
  options?: GenerateIdentifierOptions
): string;

declare function createGlobalTheme<ThemeTokens extends Tokens>(
  selector: string,
  tokens: ThemeTokens
): ThemeVars<ThemeTokens>;
declare function createGlobalTheme<ThemeContract extends Contract>(
  selector: string,
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>
): void;
declare function createTheme<ThemeTokens extends Tokens>(
  tokens: ThemeTokens,
  debugId?: string
): [className: string, vars: ThemeVars<ThemeTokens>];
declare function createTheme<ThemeContract extends Contract>(
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
  debugId?: string
): string;

declare function style(rule: ComplexStyleRule, debugId?: string): string;
/**
 * @deprecated The same functionality is now provided by the 'style' function when you pass it an array
 */
declare function composeStyles(...classNames: Array<ClassNames>): string;
declare function globalStyle(selector: string, rule: GlobalStyleRule): void;
declare function fontFace(
  rule: FontFaceRule | FontFaceRule[],
  debugId?: string
): string;
declare function globalFontFace(fontFamily: string, rule: FontFaceRule): void;
declare function keyframes(rule: CSSKeyframes, debugId?: string): string;
declare function globalKeyframes(name: string, rule: CSSKeyframes): void;
declare function styleVariants<
  StyleMap extends Record<string | number, ComplexStyleRule>
>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;
declare function styleVariants<
  Data extends Record<string | number, unknown>,
  Key extends keyof Data
>(
  data: Data,
  mapData: (value: Data[Key], key: Key) => ComplexStyleRule,
  debugId?: string
): Record<keyof Data, string>;

declare function createVar(debugId?: string): CSSVarFunction;
declare function fallbackVar(
  ...values: [string, ...Array<string>]
): CSSVarFunction;
declare function assignVars<VarContract extends Contract>(
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string>
): Record<CSSVarFunction, string>;
declare function createThemeContract<ThemeTokens extends NullableTokens>(
  tokens: ThemeTokens
): ThemeVars<ThemeTokens>;
declare function createGlobalThemeContract<ThemeTokens extends Tokens>(
  tokens: ThemeTokens
): ThemeVars<ThemeTokens>;
declare function createGlobalThemeContract<ThemeTokens extends NullableTokens>(
  tokens: ThemeTokens,
  mapFn: (value: string | null, path: Array<string>) => string
): ThemeVars<ThemeTokens>;

declare const createContainer: (debugId?: string) => string;

type LayerOptions = {
  parent?: string;
};
declare function layer(options: LayerOptions, debugId?: string): string;
declare function layer(debugId?: string): string;
declare function globalLayer(options: LayerOptions, name: string): string;
declare function globalLayer(name: string): string;

export {
  Adapter,
  CSSProperties,
  ComplexStyleRule,
  FileScope,
  GlobalStyleRule,
  StyleRule,
  assignVars,
  composeStyles,
  createContainer,
  createGlobalTheme,
  createGlobalThemeContract,
  createTheme,
  createThemeContract,
  createVar,
  fallbackVar,
  fontFace,
  generateIdentifier,
  globalFontFace,
  globalKeyframes,
  globalLayer,
  globalStyle,
  keyframes,
  layer,
  style,
  styleVariants,
};
