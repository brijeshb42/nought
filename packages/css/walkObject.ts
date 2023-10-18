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
export type Primitive = string | boolean | number | null | undefined;

export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : never;
};

export type Walkable = {
  [Key in string | number]: Primitive | Walkable;
};

export function walkObject<T extends Walkable, MapTo>(
  obj: T,
  fn: (value: Primitive, path: Array<string>) => MapTo,
  path: Array<string> = []
): MapLeafNodes<T, MapTo> {
  const clone = obj.constructor();

  for (let key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      value == null
    ) {
      clone[key] = fn(value as Primitive, currentPath);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      clone[key] = walkObject(value as Walkable, fn, currentPath);
    } else {
      console.warn(
        `Skipping invalid key "${currentPath.join(
          '.'
        )}". Should be a string, number, null or object. Received: "${
          Array.isArray(value) ? 'Array' : typeof value
        }"`
      );
    }
  }

  return clone;
}
