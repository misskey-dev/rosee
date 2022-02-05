import { MATH_BLOCK, MfmMathBlock } from '../../../node';
import { Parser } from '../../services/parser';
import { syntax } from '../parser';

export const mathBlockParser: Parser<MfmMathBlock> = syntax((ctx) => {
	// TODO

	return ctx.ok(MATH_BLOCK(''));
});
