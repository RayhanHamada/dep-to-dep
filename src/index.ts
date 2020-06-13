import fs from 'fs';
import path from 'path';
import { format } from 'prettier';

type ConvType = 'toDev' | 'toDep';

/**
 * convert dependencies to devDependencies and vice versa in package.json
 */
export async function convert(filePath: string, to: ConvType): Promise<void> {
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
      console.error(`dep-to-dep: devDependecies not exists !`);
      return;
    }

    parsedFile = {
      ...parsedFile,
      dependencies: {
        ...parsedFile.dependencies,
        ...parsedFile.devDependencies,
      },
    };
  } else if (to === 'toDev') {
    /**
     * check if dependecies is exists
     */
    if (!Object.keys(parsedFile).includes('dependencies')) {
      console.error(`dep-to-dep: dependecies not exists !`);
      return;
    }

    parsedFile = {
      ...parsedFile,
      devDependencies: {
        ...parsedFile.devDependencies,
        ...parsedFile.dependencies,
      },
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
