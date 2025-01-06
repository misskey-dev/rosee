import * as M from '..';
import { language } from './parser';
import { mergeText } from './util';

export type FullParserOpts = {
	nestLimit?: number;
};

export function fullParser(input: string, opts: FullParserOpts): M.MfmNode[] {
	const result = language.fullParser.handler(input, 0, {
		nestLimit: (opts.nestLimit != null) ? opts.nestLimit : 20,
		depth: 0,
		linkLabel: false,
		trace: false,
	});
	if (!result.success) throw new Error('Unexpected parse error');
	return mergeText(result.value);
}

export function htmlParser(input: string, opts: FullParserOpts): M.MfmHtmlNode[] {
	const result = language.htmlParser.handler(input, 0, {
		nestLimit: (opts.nestLimit != null) ? opts.nestLimit : 20,
		depth: 0,
		linkLabel: false,
		trace: false,
	});
	if (!result.success) throw new Error('Unexpected parse error');
	return mergeText(result.value);
}

export function simpleParser(input: string): M.MfmSimpleNode[] {
	const result = language.simpleParser.handler(input, 0, {
		depth: 0,
		nestLimit: 1 / 0, // reliable infinite
	});
	if (!result.success) throw new Error('Unexpected parse error');
	return mergeText(result.value);
}
