import assert from 'assert';
import * as mfm from '../src/index';
import {
	TEXT, CENTER, FN, UNI_EMOJI, MENTION, EMOJI_CODE, HASHTAG, N_URL, BOLD, SMALL, ITALIC, STRIKE, QUOTE, MATH_BLOCK, SEARCH, CODE_BLOCK, LINK
} from '../src/index';

describe('API', () => {
	describe('toString', () => {
		test('basic', () => {
			const input =
`before
<center>
Hello $[tada everynyan! 🎉]

I'm @ai, A bot of misskey!

https://github.com/syuilo/ai
</center>
after`;
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('single node', () => {
			const input = '$[tada Hello]';
			assert.strictEqual(mfm.toString(mfm.parse(input)[0]), '$[tada Hello]');
		});

		test('quote', () => {
			const input = `
> abc
> 
> 123
`;

			assert.strictEqual(mfm.toString(mfm.parse(input)), '> abc\n> \n> 123');
		});


		test('search', () => {
			const input = 'MFM 書き方 123 Search';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('block code', () => {
			const input = '```\nabc\n```';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('math block', () => {
			const input = '\\[\ny = 2x + 1\n\\]';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('center', () => {
			const input = '<center>\nabc\n</center>';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		// test('center (single line)', () => {
		// 	const input = '<center>abc</center>';
		// 	assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		// });

		test('emoji code', () => {
			const input = ':abc:';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('unicode emoji', () => {
			const input = '今起きた😇';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('big', () => {
			const input = '***abc***';
			const output = '$[tada abc]';
			assert.strictEqual(mfm.toString(mfm.parse(input)), output);
		});

		test('bold', () => {
			const input = '**abc**';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		// test('bold tag', () => {
		// 	const input = '<b>abc</b>';
		// 	assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		// });

		test('small', () => {
			const input = '<small>abc</small>';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		// test('italic', () => {
		// 	const input = '*abc*';
		// 	assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		// });

		test('italic tag', () => {
			const input = '<i>abc</i>';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		test('strike', () => {
			const input = '~~foo~~';
			assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		});

		// test('strike tag', () => {
		// 	const input = '<s>foo</s>';
		// 	assert.strictEqual(mfm.toString(mfm.parse(input)), input);
		// });

		test('inline code', () => {
			const input = 'AiScript: `#abc = 2`';
			assert.strictEqual(mfm.toString(mfm.parse(input)), 'AiScript: `#abc = 2`');
		});

		test('math inline', () => {
			const input = '\\(y = 2x + 3\\)';
			assert.strictEqual(mfm.toString(mfm.parse(input)), '\\(y = 2x + 3\\)');
		});

		test('hashtag', () => {
			const input = 'a #misskey b';
			assert.strictEqual(mfm.toString(mfm.parse(input)), 'a #misskey b');
		});

		test('link', () => {
			const input = '[Ai](https://github.com/syuilo/ai)';
			assert.strictEqual(mfm.toString(mfm.parse(input)), '[Ai](https://github.com/syuilo/ai)');
		});

		test('silent link', () => {
			const input = '?[Ai](https://github.com/syuilo/ai)';
			assert.strictEqual(mfm.toString(mfm.parse(input)), '?[Ai](https://github.com/syuilo/ai)');
		});

		test('fn', () => {
			const input = '$[tada Hello]';
			assert.strictEqual(mfm.toString(mfm.parse(input)), '$[tada Hello]');
		});

		test('fn with arguments', () => {
			const input = '$[spin.speed=1s,alternate Hello]';
			assert.strictEqual(mfm.toString(mfm.parse(input)), '$[spin.speed=1s,alternate Hello]');
		});

		test('plain', () => {
			const input = 'a\n<plain>\nHello\nworld\n</plain>\nb';
			assert.strictEqual(mfm.toString(mfm.parse(input)), 'a\n<plain>\nHello\nworld\n</plain>\nb');
		});

		test('1 line plain', () => {
			const input = 'a\n<plain>Hello</plain>\nb';
			assert.strictEqual(mfm.toString(mfm.parse(input)), 'a\n<plain>\nHello\n</plain>\nb');
		});

		test('preserve url brackets', () => {
			const input1 = 'https://github.com/syuilo/ai';
			assert.strictEqual(mfm.toString(mfm.parse(input1)), input1);

			const input2 = '<https://github.com/syuilo/ai>';
			assert.strictEqual(mfm.toString(mfm.parse(input2)), input2);
		});
	});

	describe('inspect', () => {
		test('replace text', () => {
			const input = 'good morning $[tada everynyan!]';
			const result = mfm.parse(input);
			mfm.inspect(result, node => {
				if (node.type == 'text') {
					node.props.text = node.props.text.replace(/good morning/g, 'hello');
				}
			});
			assert.strictEqual(mfm.toString(result), 'hello $[tada everynyan!]');
		});

		test('replace text (one item)', () => {
			const input = 'good morning $[tada everyone!]';
			const result = mfm.parse(input);
			mfm.inspect(result[1], node => {
				if (node.type == 'text') {
					node.props.text = node.props.text.replace(/one/g, 'nyan');
				}
			});
			assert.strictEqual(mfm.toString(result), 'good morning $[tada everynyan!]');
		});
	});

	describe('extract', () => {
		test('basic', () => {
			const nodes = mfm.parse('@hoge @piyo @bebeyo');
			const expect = [
				MENTION('hoge', null, '@hoge'),
				MENTION('piyo', null, '@piyo'),
				MENTION('bebeyo', null, '@bebeyo')
			];
			assert.deepStrictEqual(mfm.extract(nodes, node => node.type == 'mention'), expect);
		});

		test('nested', () => {
			const nodes = mfm.parse('abc:hoge:$[tada 123 @hoge :foo:]:piyo:');
			const expect = [
				EMOJI_CODE('foo'),
				EMOJI_CODE('piyo')
			];
			assert.deepStrictEqual(mfm.extract(nodes, node => node.type == 'emojiCode'), expect);
		});
	});
});
