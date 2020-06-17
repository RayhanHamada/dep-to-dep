import { expect } from 'chai';
import { filterKeys, filterDep } from '../src/index';

const mockDep = {
  '@types/chai': '^4.2.11',
  '@types/mocha': '^7.0.2',
  '@types/node': '^14.0.13',
  '@types/prettier': '^2.0.1',
  '@typescript-eslint/eslint-plugin': '^3.2.0',
  '@typescript-eslint/parser': '^3.2.0',
  chai: '^4.2.0',
  eslint: '^7.2.0',
  mocha: '^8.0.1',
  prettier: '^2.0.5',
  'ts-mocha': '^7.0.0',
  'ts-node': '^8.10.2',
  typescript: '^3.9.5',
};

describe('dep-to-dep', function () {
  it('filterKeys should return all string in mockDep (exclude nothing)', () => {
    /**
     * get all keys from mockDep
     */
    const keys = Object.keys(mockDep);
    const excludes = [];

    /**
     * call filterKeys and expect value
     */
    const filteredKeys = filterKeys(keys, excludes);
    const expectedValue = [
      '@types/chai',
      '@types/mocha',
      '@types/node',
      '@types/prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'chai',
      'eslint',
      'mocha',
      'prettier',
      'ts-mocha',
      'ts-node',
      'typescript',
    ];

    expect(JSON.stringify(filteredKeys)).to.be.equal(
      JSON.stringify(expectedValue)
    );
  });

  it('filterKeys should return string array with no "@types/" word in it ', () => {
    /**
     * get all keys from mockDep
     */
    const keys = Object.keys(mockDep);
    const excludes = [/^@types\//];

    /**
     * call filterKeys and expect value
     */
    const filteredKeys = filterKeys(keys, excludes);
    const expectedValue = [
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'chai',
      'eslint',
      'mocha',
      'prettier',
      'ts-mocha',
      'ts-node',
      'typescript',
    ];

    expect(JSON.stringify(filteredKeys)).to.be.equal(
      JSON.stringify(expectedValue),
      `filteredKeys:    ${JSON.stringify(filteredKeys)}\n`
    );
  });

  it('filterDep should return object with no excludes', () => {
    const keys = Object.keys(mockDep);
    const excludes = [];

    const filteredKeys = filterKeys(keys, excludes);
    const filteredDep = filterDep(filteredKeys, mockDep);

    expect(JSON.stringify(filteredDep)).to.be.equal(JSON.stringify(mockDep));
  });

  it('filterDep should return object but excludes key(s) that prefixed with "@types/"', () => {
    const keys = Object.keys(mockDep);
    const excludes = [/^@types\//];

    const filteredKeys = filterKeys(keys, excludes);
    const expectedValue = {
      '@typescript-eslint/eslint-plugin': '^3.2.0',
      '@typescript-eslint/parser': '^3.2.0',
      chai: '^4.2.0',
      eslint: '^7.2.0',
      mocha: '^8.0.1',
      prettier: '^2.0.5',
      'ts-mocha': '^7.0.0',
      'ts-node': '^8.10.2',
      typescript: '^3.9.5',
    };

    const expecting = filterDep(filteredKeys, mockDep);

    expect(JSON.stringify(expecting)).to.be.equal(
      JSON.stringify(expectedValue)
    );
  });
});
