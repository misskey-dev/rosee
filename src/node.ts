export type MfmNode = MfmBlock | MfmInline;

export type MfmSimpleNode = MfmUnicodeEmoji | MfmEmojiCode | MfmText | MfmPlain;

export type MfmBlock = MfmQuote | MfmSearch | MfmCodeBlock | MfmMathBlock | MfmCenter;

const blockTypes: MfmNode['type'][] = [ 'quote', 'search', 'blockCode', 'mathBlock', 'center' ];
export function isMfmBlock(node: MfmNode): node is MfmBlock {
	return blockTypes.includes(node.type);
}

export type MfmQuote = {
	type: 'quote';
	props?: Record<string, unknown>;
	children: MfmNode[];
};
export const QUOTE = (children: MfmNode[]): NodeType<'quote'> => { return { type: 'quote', children }; };

export type MfmSearch = {
	type: 'search';
	props: {
		query: string;
		content: string;
	};
	children?: [];
};
export const SEARCH = (query: string, content: string): NodeType<'search'> => { return { type: 'search', props: { query, content } }; };

export type MfmCodeBlock = {
	type: 'blockCode';
	props: {
		code: string;
		lang: string | null;
	};
	children?: [];
};
export const CODE_BLOCK = (code: string, lang: string | null): NodeType<'blockCode'> => { return { type: 'blockCode', props: { code, lang } }; };

export type MfmMathBlock = {
	type: 'mathBlock';
	props: {
		formula: string;
	};
	children?: [];
};
export const MATH_BLOCK = (formula: string): NodeType<'mathBlock'> => { return { type: 'mathBlock', props: { formula } }; };

export type MfmCenter = {
	type: 'center';
	props?: Record<string, unknown>;
	children: MfmInline[];
};
export const CENTER = (children: MfmInline[]): NodeType<'center'> => { return { type: 'center', children }; };

export type MfmInline = MfmUnicodeEmoji | MfmEmojiCode | MfmBold | MfmSmall | MfmItalic | MfmStrike |
	MfmInlineCode | MfmMathInline | MfmMention | MfmHashtag | MfmUrl | MfmLink | MfmFn | MfmPlain | MfmText;

export type MfmUnicodeEmoji = {
	type: 'unicodeEmoji';
	props: {
		emoji: string;
	};
	children?: [];
};
export const UNI_EMOJI = (value: string): NodeType<'unicodeEmoji'> => { return { type: 'unicodeEmoji', props: { emoji: value } }; };

export type MfmEmojiCode = {
	type: 'emojiCode';
	props: {
		name: string;
	};
	children?: [];
};
export const EMOJI_CODE = (name: string): NodeType<'emojiCode'> => { return { type: 'emojiCode', props: { name: name } }; };

export type MfmBold = {
	type: 'bold';
	props?: Record<string, unknown>;
	children: MfmInline[];
};
export const BOLD = (children: MfmInline[]): NodeType<'bold'> => { return { type: 'bold', children }; };

export type MfmSmall = {
	type: 'small';
	props?: Record<string, unknown>;
	children: MfmInline[];
};
export const SMALL = (children: MfmInline[]): NodeType<'small'> => { return { type: 'small', children }; };

export type MfmItalic = {
	type: 'italic';
	props?: Record<string, unknown>;
	children: MfmInline[];
};
export const ITALIC = (children: MfmInline[]): NodeType<'italic'> => { return { type: 'italic', children }; };

export type MfmStrike = {
	type: 'strike';
	props?: Record<string, unknown>;
	children: MfmInline[];
};
export const STRIKE = (children: MfmInline[]): NodeType<'strike'> => { return { type: 'strike', children }; };

export type MfmInlineCode = {
	type: 'inlineCode';
	props: {
		code: string;
	};
	children?: [];
};
export const INLINE_CODE = (code: string): NodeType<'inlineCode'> => { return { type: 'inlineCode', props: { code } }; };

export type MfmMathInline = {
	type: 'mathInline';
	props: {
		formula: string;
	};
	children?: [];
};
export const MATH_INLINE = (formula: string): NodeType<'mathInline'> => { return { type: 'mathInline', props: { formula } }; };

export type MfmMention = {
	type: 'mention';
	props: {
		username: string;
		host: string | null;
		acct: string;
	};
	children?: [];
};
export const MENTION = (username: string, host: string | null, acct: string): NodeType<'mention'> => { return { type: 'mention', props: { username, host, acct } }; };

export type MfmHashtag = {
	type: 'hashtag';
	props: {
		hashtag: string;
	};
	children?: [];
};
export const HASHTAG = (value: string): NodeType<'hashtag'> => { return { type: 'hashtag', props: { hashtag: value } }; };

export type MfmUrl = {
	type: 'url';
	props: {
		url: string;
		brackets?: boolean;
	};
	children?: [];
};
export const N_URL = (value: string, brackets?: boolean): NodeType<'url'> => {
	const node: MfmUrl = { type: 'url', props: { url: value } };
	if (brackets) node.props.brackets = brackets;
	return node;
};

export type MfmLink = {
	type: 'link';
	props: {
		silent: boolean;
		url: string;
	};
	children: MfmInline[];
};
export const LINK = (silent: boolean, url: string, children: MfmInline[]): NodeType<'link'> => { return { type: 'link', props: { silent, url }, children }; };

export type MfmFn = {
	type: 'fn';
	props: {
		name: string;
		args: Record<string, string | true>;
	};
	children: MfmInline[];
};
export const FN = (name: string, args: MfmFn['props']['args'], children: MfmFn['children']): NodeType<'fn'> => { return { type: 'fn', props: { name, args }, children }; };

export type MfmPlain = {
	type: 'plain';
	props?: Record<string, unknown>;
	children: MfmText[];
};
export const PLAIN = (text: string): NodeType<'plain'> => { return { type: 'plain', children: [TEXT(text)] }; };

export type MfmText = {
	type: 'text';
	props: {
		text: string;
	};
	children?: [];
};
export const TEXT = (value: string): NodeType<'text'> => { return { type: 'text', props: { text: value } }; };

export type NodeType<T extends MfmNode['type']> =
	T extends 'quote' ? MfmQuote :
	T extends 'search' ? MfmSearch :
	T extends 'blockCode' ? MfmCodeBlock :
	T extends 'mathBlock' ? MfmMathBlock :
	T extends 'center' ? MfmCenter :
	T extends 'unicodeEmoji' ? MfmUnicodeEmoji :
	T extends 'emojiCode' ? MfmEmojiCode :
	T extends 'bold' ? MfmBold :
	T extends 'small' ? MfmSmall :
	T extends 'italic' ? MfmItalic :
	T extends 'strike' ? MfmStrike :
	T extends 'inlineCode' ? MfmInlineCode :
	T extends 'mathInline' ? MfmMathInline :
	T extends 'mention' ? MfmMention :
	T extends 'hashtag' ? MfmHashtag :
	T extends 'url' ? MfmUrl :
	T extends 'link' ? MfmLink :
	T extends 'fn' ? MfmFn :
	T extends 'plain' ? MfmPlain :
	T extends 'text' ? MfmText :
	never;
