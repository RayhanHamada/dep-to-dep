declare type ConvType = 'toDev' | 'toDep';
declare type DepObject = Record<string, string>;
/**
 * convert dependencies to devDependencies and vice versa in package.json
 */
export declare function convert(filePath: string, to: ConvType, excludes?: RegExp[]): Promise<void>;
/**
 * for filtering keys
 */
export declare const filterKeys: (keys: string[], patterns: RegExp[]) => string[];
/**
 * for make object with filtered keys
 */
export declare const filterDep: (keys: string[], depObject: DepObject) => DepObject;
export {};
