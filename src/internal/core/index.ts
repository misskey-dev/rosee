//
// Parsimmon-like stateful parser combinators
//

export type Success<T> = {
	success: true;
	value: T;
	index: number;
};

export type Failure = { success: false };

export type Result<T> = Success<T> | Failure;

export interface StateBase {
	trace?: boolean,
}

export type ParserHandler<T, S extends StateBase> = (input: string, index: number, state: S) => Result<T>

export function success<T>(index: number, value: T): Success<T> {
	return {
		success: true,
		value: value,
		index: index,
	};
}

export function failure(): Failure {
	return { success: false };
}

export class Parser<T, S extends StateBase> {
	public name?: string;
	public handler: ParserHandler<T, S>;

	constructor(handler: ParserHandler<T, S>, name?: string) {
		this.handler = (input, index, state) : Failure | Success<T> => {
			if (state.trace && this.name != null) {
				const pos = `${index}`;
				console.log(`${pos.padEnd(6, ' ')}enter ${this.name}`);
				const result = handler(input, index, state);
				if (result.success) {
					const pos = `${index}:${result.index}`;
					console.log(`${pos.padEnd(6, ' ')}match ${this.name}`);
				} else {
					const pos = `${index}`;
					console.log(`${pos.padEnd(6, ' ')}fail ${this.name}`);
				}
				return result;
			}
			return handler(input, index, state);
		};
		this.name = name;
	}

	map<U>(fn: (value: T) => U): Parser<U, S> {
		return new Parser((input, index, state) => {
			const result = this.handler(input, index, state);
			if (!result.success) {
				return result;
			}
			return success(result.index, fn(result.value));
		});
	}

	text(): Parser<string, S> {
		return new Parser((input, index, state) => {
			const result = this.handler(input, index, state);
			if (!result.success) {
				return result;
			}
			const text = input.slice(index, result.index);
			return success(result.index, text);
		});
	}

	many(min: number): Parser<T[], S> {
		return new Parser((input, index, state) => {
			let result;
			let latestIndex = index;
			const accum: T[] = [];
			while (latestIndex < input.length) {
				result = this.handler(input, latestIndex, state);
				if (!result.success) {
					break;
				}
				latestIndex = result.index;
				accum.push(result.value);
			}
			if (accum.length < min) {
				return failure();
			}
			return success(latestIndex, accum);
		});
	}

	sep(separator: Parser<unknown, S>, min: number): Parser<T[], S> {
		if (min < 1) {
			throw new Error('"min" must be a value greater than or equal to 1.');
		}
		return seq(
			this as Parser<T, S>,
			seq(
				separator,
				this as Parser<T, S>,
			).select(1).many(min - 1),
		).map(result => [result[0], ...result[1]]);
	}

	select<K extends keyof T>(key: K): Parser<T[K], S> {
		return this.map(v => v[key]);
	}

	option(): Parser<T | null, S> {
		return alt([
			this as Parser<T, S>,
			succeeded(null),
		]);
	}
}

export function str<T extends string>(value: T): Parser<T, object> {
	return new Parser((input, index, _state) => {
		if ((input.length - index) < value.length) {
			return failure();
		}
		if (input.substr(index, value.length) !== value) {
			return failure();
		}
		return success(index + value.length, value);
	});
}

export function regexp<T extends RegExp>(pattern: T): Parser<string, object> {
	const re = RegExp(`^(?:${pattern.source})`, pattern.flags);
	return new Parser((input, index, _state) => {
		const text = input.slice(index);
		const result = re.exec(text);
		if (result == null) {
			return failure();
		}
		return success(index + result[0].length, result[0]);
	});
}

type ParsedType<T extends Parser<unknown, never>> = T extends Parser<infer U, never> ? U : never;

export type SeqParseResult<T extends unknown[]> =
	T extends [] ? [] 
		: T extends [infer F, ...infer R]
		? (
			F extends Parser<unknown, never> ? [ParsedType<F>, ...SeqParseResult<R>] : [unknown, ...SeqParseResult<R>]
			)
		: unknown[];

export type CommonState<T extends unknown[]> =
	T extends [] ? StateBase
		: T extends [Parser<unknown, infer S>, ...infer R] ? S & CommonState<R>
		: T extends Parser<unknown, infer S>[] ? S
		: never;

export function seq<Parsers extends Parser<unknown, never>[]>(...parsers: Parsers): Parser<SeqParseResult<Parsers>, CommonState<Parsers>> {
	return new Parser((input, index, state) => {
		let result;
		let latestIndex = index;
		const accum = [];
		for (let i = 0; i < parsers.length; i++) {
			result = parsers[i].handler(input, latestIndex, state as never);
			if (!result.success) {
				return result;
			}
			latestIndex = result.index;
			accum.push(result.value);
		}
		return success(latestIndex, accum as SeqParseResult<Parsers>);
	});
}

export function alt<Parsers extends Parser<unknown, never>[]>(parsers: Parsers): Parser<ParsedType<Parsers[number]>, CommonState<Parsers>> {
	return new Parser<ParsedType<Parsers[number]>, CommonState<Parsers>>((input, index, state): Result<ParsedType<Parsers[number]>> => {
		for (let i = 0; i < parsers.length; i++) {
			const parser: Parsers[number] = parsers[i];
			const result = parser.handler(input, index, state as never);
			if (result.success) {
				return result as Result<ParsedType<Parsers[number]>>;
			}
		}
		return failure();
	});
}

function succeeded<T>(value: T): Parser<T, StateBase> {
	return new Parser((_input, index, _state) => {
		return success(index, value);
	});
}

export function notMatch<S extends StateBase>(parser: Parser<unknown, S>): Parser<null, S> {
	return new Parser((input, index, state) => {
		const result = parser.handler(input, index, state);
		return !result.success
			? success(index, null)
			: failure();
	});
}

export const cr = str('\r');
export const lf = str('\n');
export const crlf = str('\r\n');
export const newline = alt([crlf, cr, lf]);

export const char = new Parser((input, index, _state) => {
	if ((input.length - index) < 1) {
		return failure();
	}
	const value = input.charAt(index);
	return success(index + 1, value);
});

export const lineBegin = new Parser((input, index, state) => {
	if (index === 0) {
		return success(index, null);
	}
	if (cr.handler(input, index - 1, state).success) {
		return success(index, null);
	}
	if (lf.handler(input, index - 1, state).success) {
		return success(index, null);
	}
	return failure();
});

export const lineEnd = new Parser((input, index, state) => {
	if (index === input.length) {
		return success(index, null);
	}
	if (cr.handler(input, index, state).success) {
		return success(index, null);
	}
	if (lf.handler(input, index, state).success) {
		return success(index, null);
	}
	return failure();
});

export function lazy<T, S extends StateBase>(fn: () => Parser<T, S>): Parser<T, S> {
	const parser: Parser<T, S> = new Parser((input, index, state) => {
		parser.handler = fn().handler;
		return parser.handler(input, index, state);
	});
	return parser;
}

//type Syntax<T> = (rules: Record<string, Parser<T>>) => Parser<T>;
//type SyntaxReturn<T> = T extends (rules: Record<string, Parser<any>>) => infer R ? R : never;
//export function createLanguage2<T extends Record<string, Syntax<any>>>(syntaxes: T): { [K in keyof T]: SyntaxReturn<T[K]> } {

type ParserTable<T> = { [K in keyof T]: Parser<T[K], StateBase> };

// TODO: 関数の型宣言をいい感じにしたい
export function createLanguage<T>(syntaxes: { [K in keyof T]: (r: ParserTable<T>) => Parser<T[K], never> }): ParserTable<T> {
	// @ts-expect-error initializing object so type error here
	const rules: ParserTable<T> = {};
	for (const key of Object.keys(syntaxes) as (keyof T & string)[]) {
		rules[key] = lazy(() => {
			const parser = syntaxes[key](rules);
			if (parser == null) {
				throw new Error('syntax must return a parser.');
			}
			parser.name = key;
			return parser;
		}) as Parser<T[keyof T & string], StateBase>;
	}
	return rules;
}
