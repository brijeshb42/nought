# Nought

Nought is a zero-runtime css-in-js library. It is implemented on top of `linaria` to extract the css at build-time.

The APIs are same as that of `vanilla-extract` without the limitation that they can be used only in a `css.ts` file. In case of `Nought`, you can import the functions in any file. The style definitions can live in the same file as the components that they are used in.

This is not to say that `Nought` doesn't have any limitations of it's own. See [below](#things-to-note).

## Installation

Since it is zero-runtime, nought needs to be part of the build process and won't work without it. Right now, only Vite is supported with more bundlers coming in. To use -

```sh
npm install @nought/css
npm install --save-dev @nought/vite
```

In your `vite.config.ts` file, import the plugin and pass it to vite.

```ts
import { defineConfig } from 'vite';
import { nought } from '@nought/vite';

export default defineConfig({
  plugins: [
    nought(),
    // your other plugins
  ],
});
```

The overall installation and usage process will be same as other bundlers as well.

### Usage

Since the API and imports are same as that of `vanilla-extract`, you can follow the `vanilla-extract` [documentation](https://vanilla-extract.style/documentation/api/style/) to see how to use this package, except the imports will be from `@nought/css` instead of `vanilla-extract`. If you find that there is an API that isn't supported or something is different, please report a bug [here](https://github.com/brijeshb42/nought/issues/new).

### Things to note

Mainly the items that behave differently than `vanilla-extract` are -

1. For `globalLayer`/`globalKeyframes` or any other global css function that accepts a string as the first argument, it should always be a static string that is passed instead of a variable (even if the value of the variable is static).
2. The tokens object passed to `createThemeContract`/`createGlobalThemeContract` should also be fully static. They cannot reference any local variables. And the map function passed as 2nd argument to `createGlobalThemeContract` should be pure function that only uses the arguments that are passed to it and return a string based on that. It cannot even use any file level variables. This is because the context in which this function will get executed will be very different than the context of the file that has the definition of the function.
3. Same for the 1st argument of `assignVars`. The argument passed should be the returned value of a `createThemeContract`/`createGlobalThemeContract` call and if using any members of the object, it should be statically determinable, eg-

   ```ts
   const themeContract = createGlobalThemeContract({
     palette: {
       primary: {
         main: 'string',
       },
     },
   });
   // Can do this
   const className = style({
     vars: assignVars(themeContract.palette, {
       main: 'red',
     }),
   });
   // cannot do this
   const paletteKey = 'palette';
   const className = style({
     vars: assignVars(themeContract[paletteKey], {
       main: 'red',
     }),
   });
   ```

   One thing to note is that the 2nd argument does not need to be static. It can use local variables for any of the values.

4. There's an issue with `layer`/`globalLayer` where if you don't use those layers in a `style()` call, they won't be part of the generated CSS file.

   ```ts
   // themeFile.ts
   import { layer } from '@nought/css';
   export const utilsLayer = layer('utils');

   // entry/main.ts
   const unusedClass = style({
     utilsLayer: {},
   });
   ```

5. When using `fallbackVar`, the css variable created using `createVar` that is passed as the first argument should be created in the same file as the `fallbackVar` call.
