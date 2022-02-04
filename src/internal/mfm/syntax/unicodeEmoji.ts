import { MfmUnicodeEmoji, UNI_EMOJI } from '../../../node';
import { cache, Parser } from '../../services/parser';
import emojiRegex from 'twemoji-parser/dist/lib/regex';
const anchoredEmojiRegex = RegExp(`^(?:${emojiRegex.source})`);

export const unicodeEmojiMatcher: Parser<MfmUnicodeEmoji> = cache((ctx) => {
	const matched = ctx.regex(anchoredEmojiRegex);
	if (matched == null) {
		return ctx.fail();
	}
	ctx.pos += matched[0].length;

	return ctx.ok(UNI_EMOJI(matched[0]));
});
