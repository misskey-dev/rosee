/**
 * Unit testing TypeScript types.
 * with https://github.com/SamVerschueren/tsd
 */

import { expectType } from 'tsd';
import { NodeType, MfmUrl } from '../src';
import * as P from '../src/internal/core';

describe('#NodeType', () => {
	test('returns node that has sprcified type', () => {
		const x = null as unknown as NodeType<'url'>;
		expectType<MfmUrl>(x);
	});
});

describe('parser internals', () => {
	test('seq', () => {
		const first = null as unknown as P.Parser<'first'>;
		const second = null as unknown as P.Parser<'second'>;
		const third = null as unknown as P.Parser<'third' | 'third-second'>;
		expectType<P.Parser<['first', 'second', 'third' | 'third-second']>>(P.seq(first, second, third));
	});
	test('alt', () => {
		const first = null as unknown as P.Parser<'first'>;
		const second = null as unknown as P.Parser<'second'>;
		const third = null as unknown as P.Parser<'third' | 'third-second'>;
		expectType<P.Parser<'first' | 'second' | 'third' | 'third-second'>>(P.alt([first, second, third]));
	});
});
