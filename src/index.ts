import fs from 'fs';
import path from 'path';
import { format } from 'prettier';

type ConvType = 'toDev' | 'toDep';

type DepObject = Record<string, string>;

/**
 * convert dependencies to devDependencies and vice versa in package.json
 */
export async function convert(
  filePath: string,
  to: ConvType,
  excludes?: RegExp[]
): Promise<void> {
  const resolvedPath = path.resolve(process.cwd(), filePath);

  const file = await fs.promises
    .readFile(resolvedPath, { encoding: 'utf-8' })
    .catch(() => {
      console.error(`dep-to-dep: error when reading file, check the path`);
      return;
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedFile: any;
  try {
    parsedFile = JSON.parse(file as string);
  } catch (e) {
    console.error(`dep-to-dep: error when parsing file`);
    return;
  }

  if (to === 'toDep') {
    /**
     * check if devDependencies is exists
     */
    if (!Object.keys(parsedFile).includes('devDependencies')) {
      console.error(`dep-to-dep: devDependencies not exists !`);
      return;
    }

    /**
     * get keys from devDependecies, and if exclude is not undefined
     * then filter the keys
     */
    const keys = Object.keys(parsedFile.devDependencies);

    const filteredKeys =
      excludes === undefined ? keys : filterKeys(keys, excludes);

    const filteredPair = filterDep(filteredKeys, parsedFile.devDependencies);

    parsedFile = {
      ...parsedFile,
      devDependencies: {},
      dependencies: {
        ...parsedFile.dependencies,
        ...filteredPair,
      },
    };
  } else if (to === 'toDev') {
    /**
     * check if dependecies is exists
     */
    if (!Object.keys(parsedFile).includes('dependencies')) {
      console.error(`dep-to-dep: dependencies not exists !`);
      return;
    }

    /**
     * get keys from dependencies, and if exclude is not undefined
     * then filter the keys
     */
    const keys = Object.keys(parsedFile.dependencies);

    const filteredKeys =
      excludes === undefined ? keys : filterKeys(keys, excludes);

    const filteredPair = filterDep(filteredKeys, parsedFile.dependencies);

    parsedFile = {
      ...parsedFile,
      devDependencies: {
        ...parsedFile.devDependencies,
        ...filteredPair,
      },
      dependencies: {},
    };
  } else {
    console.error(`dep-to-dep: invalid ConvTypes !`);
    return;
  }

  /**
   * prettify stringified json first
   */
  let formatted: string;
  try {
    formatted = format(JSON.stringify(parsedFile), { parser: 'json' });
  } catch (e) {
    console.error(`format error`);
    return;
  }

  /**
   * write back to package.json
   */
  await fs.promises.writeFile(resolvedPath, formatted).catch(() => {
    console.error(`dep-to-dep: error when writing file`);
    return;
  });
}

/**
 * for filtering keys
 */
export const filterKeys = (keys: string[], patterns: RegExp[]): string[] =>
  keys.filter(
    key =>
      !patterns.reduce<boolean>((prev, curr) => prev || curr.test(key), false)
  );

/**
 * for make object with filtered keys
 */
export const filterDep = (keys: string[], depObject: DepObject): DepObject =>
  keys.reduce<DepObject>(
    (prev, curr) => ({ ...prev, [curr]: depObject[curr] }),
    {}
  );
