import { LINK, MfmInline, MfmLink } from '../../../node';
import { Parser } from '../../services/parser';
import { CharCode } from '../../services/character';
import { inlineParser } from '../parser';
import { urlAltParser, urlParser } from './url';
import { pushNode, syntax } from '../services';

export const linkParser: Parser<MfmLink> = syntax('link', (ctx) => {
	let matched;

	// "?" (option)
	matched = ctx.char(CharCode.question);
	const silent = matched.ok;

	// "["
	if (!ctx.char(CharCode.openBracket).ok) {
		return ctx.fail();
	}

	// link label
	const label: MfmInline[] = [];
	ctx.inLink = true;
	while (true) {
		if (ctx.matchChar(CharCode.closeBracket)) break;

		matched = ctx.parser(inlineParser);
		if (!matched.ok) break;
		pushNode(matched.result, label);
	}
	ctx.inLink = false;
	if (label.length < 1) {
		return ctx.fail();
	}

	// "]("
	if (!ctx.str('](').ok) {
		return ctx.fail();
	}

	// url
	matched = ctx.choice([
		urlAltParser,
		urlParser,
	]);
	if (!matched.ok) {
		return ctx.fail();
	}
	const url = matched.result;

	// ")"
	if (!ctx.char(CharCode.closeParen).ok) {
		return ctx.fail();
	}

	return ctx.ok(LINK(silent, url.props.url, label));
});
