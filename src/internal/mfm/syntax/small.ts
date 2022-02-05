import { MfmInline, MfmSmall, SMALL } from '../../../node';
import { Parser } from '../../services/parser';
import { inlineParser } from '../parser';
import { pushNode, syntax } from '../services';

export const smallTagParser: Parser<MfmSmall> = syntax('small', (ctx) => {
	let matched;

	// "<small>"
	if (!ctx.str('<small>').ok) {
		return ctx.fail();
	}

	// children
	const children: MfmInline[] = [];
	while (true) {
		if (ctx.matchStr('</small>')) break;

		matched = ctx.parser(inlineParser);
		if (!matched.ok) break;
		pushNode(matched.result, children);
	}
	if (children.length < 1) {
		return ctx.fail();
	}

	// "</small>"
	if (!ctx.str('</small>').ok) {
		return ctx.fail();
	}

	return ctx.ok(SMALL(children));
});
