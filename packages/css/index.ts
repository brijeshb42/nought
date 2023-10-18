import type {
  style as vanillaStyle,
  createVar as vanillaCreateVar,
  styleVariants as vanillaStyleVariants,
  fallbackVar as vanillaFallbackVar,
  createTheme as vanillaCreateTheme,
  createGlobalTheme as vanillaCreateGlobalTheme,
  createThemeContract as vanillaCreateThemeContract,
  assignVars as vanillaAssignVars,
  fontFace as vanillaFontFace,
  globalFontFace as vanillaGlobalFontFace,
  keyframes as vanillaKeyframes,
  globalKeyframes as vanillaGlobalKeyframes,
  createContainer as vanillaCreateContainer,
  layer as vanillaLayer,
  globalLayer as globalVanillaLayer,
  globalStyle as vanillaGlobalStyle,
  createGlobalThemeContract as vanillaCreateGlobalThemeContract,
} from './vanilla-extract';
export { walkObject } from './walkObject';

const LIB_NAME = '@nought/runtime';
const MESSAGE = 'Please configure your bundler.';
function getPrefix(fnName: string, log = MESSAGE) {
  return `${LIB_NAME}:${fnName} - ${log}`;
}

export const style: typeof vanillaStyle = () => {
  throw new Error(getPrefix('style'));
};

export const createVar: typeof vanillaCreateVar = () => {
  throw new Error(getPrefix('createVar'));
};

export const styleVariants: typeof vanillaStyleVariants = () => {
  throw new Error(getPrefix('styleVariants'));
};

export const fallbackVar: typeof vanillaFallbackVar = () => {
  throw new Error(getPrefix('fallbackVar'));
};

export const createTheme: typeof vanillaCreateTheme = () => {
  throw new Error(getPrefix('createTheme'));
};

export const createThemeContract: typeof vanillaCreateThemeContract = () => {
  throw new Error(getPrefix('createThemeContract'));
};

export const assignVars: typeof vanillaAssignVars = () => {
  throw new Error(getPrefix('assignVars'));
};

export const fontFace: typeof vanillaFontFace = () => {
  throw new Error(getPrefix('fontFace'));
};

export const globalFontFace: typeof vanillaGlobalFontFace = () => {
  throw new Error(getPrefix('globalFontFace'));
};

export const keyframes: typeof vanillaKeyframes = () => {
  throw new Error(getPrefix('keyframes'));
};

export function globalKeyframes(
  ...args: Parameters<typeof vanillaGlobalKeyframes>
): string {
  throw new Error(getPrefix('globalKeyframes'));
}

export const createContainer: typeof vanillaCreateContainer = () => {
  throw new Error(getPrefix('createContainer'));
};

export const layer: typeof vanillaLayer = () => {
  throw new Error(getPrefix('layer'));
};

export const globalLayer: typeof globalVanillaLayer = () => {
  throw new Error(getPrefix('globalLayer'));
};

export const globalStyle: typeof vanillaGlobalStyle = () => {
  throw new Error(getPrefix('globalStyle'));
};

export const createGlobalTheme: typeof vanillaCreateGlobalTheme = () => {
  throw new Error(getPrefix('createGlobalTheme'));
};

export const createGlobalThemeContract: typeof vanillaCreateGlobalThemeContract =
  () => {
    throw new Error(getPrefix('createGlobalThemeContract'));
  };
