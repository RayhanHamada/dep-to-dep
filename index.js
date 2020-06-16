"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettier_1 = require("prettier");
/**
 * convert dependencies to devDependencies and vice versa in package.json
 */
async function convert(filePath, to) {
    const resolvedPath = path_1.default.resolve(process.cwd(), filePath);
    const file = await fs_1.default.promises
        .readFile(resolvedPath, { encoding: 'utf-8' })
        .catch(() => {
        console.error(`dep-to-dep: error when reading file, check the path`);
        return;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedFile;
    try {
        parsedFile = JSON.parse(file);
    }
    catch (e) {
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
        parsedFile = {
            ...parsedFile,
            devDependencies: {},
            dependencies: {
                ...parsedFile.dependencies,
                ...parsedFile.devDependencies,
            },
        };
    }
    else if (to === 'toDev') {
        /**
         * check if dependecies is exists
         */
        if (!Object.keys(parsedFile).includes('dependencies')) {
            console.error(`dep-to-dep: dependencies not exists !`);
            return;
        }
        parsedFile = {
            ...parsedFile,
            devDependencies: {
                ...parsedFile.devDependencies,
                ...parsedFile.dependencies,
            },
            dependencies: {},
        };
    }
    else {
        console.error(`dep-to-dep: invalid ConvTypes !`);
        return;
    }
    /**
     * prettify stringified json first
     */
    let formatted;
    try {
        formatted = prettier_1.format(JSON.stringify(parsedFile), { parser: 'json' });
    }
    catch (e) {
        console.error(`format error`);
        return;
    }
    /**
     * write back to package.json
     */
    await fs_1.default.promises.writeFile(resolvedPath, formatted).catch(() => {
        console.error(`dep-to-dep: error when writing file`);
        return;
    });
}
exports.convert = convert;
