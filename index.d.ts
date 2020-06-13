declare type ConvType = 'toDev' | 'toDep';
/**
 * convert dependencies to devDependencies and vice versa in package.json
 */
export declare function convert(filePath: string, to: ConvType): Promise<void>;
export {};
