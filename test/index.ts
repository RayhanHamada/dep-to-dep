import { convert } from '../src/index';

convert('./test/package.json', 'toDep').then(() => {
  console.log(`done !`);
});
