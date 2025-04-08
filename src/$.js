const

	publishedPtr = {},

	resolverSignatureGenCB = function*(length = 52) {
		let buf;
		for(let i = 0; i < length; i++) {
			buf = Math.floor(Math.random() * 31)
			yield 0x7f + buf + (buf > 0x8d) + (buf > 0x9c)
		}
	},

	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),

	UNDEFINED = Symbol("UNDEFINED"),

	boolOps = {
		or: (a, b) => a || b,
		and: (a, b) => a && b,
		xor: (a, b) => a ^ b
	},

	opTemp = Object.assign(

		{

			[Symbol.toPrimitive](_, hint) {
				return hint === PTR_IDENTIFIER
			},

			watch(buffer, watcherFn) {
				if(watcherFn) {
					buffer[2].set(watcherFn, [
						buffer[1].push(watcherFn) - 1,
						!0
					])
				};
				return this;
			},

			abort(buffer, watcherFn) {
				if(watcherFn) {
					const info = buffer[2].get(watcherFn);
					info[1] = !1;
					delete buffer[1][info?.[0]];
				};
				return this;
			},

			into(buffer, transformerFn = $ => $) {
				const newPtr = createPtr(transformerFn(buffer[0]))
				this.watch($ => newPtr.$ = transformerFn($));
				return newPtr;
			},

			until(_, value) {
				return new Promise(r => {
					const watcherFn = $ => (typeof value == "function" ? value($) : $ === value)
						? (this.abort(watcherFn), r(this))
						: !1
					;
					this.watch(watcherFn);
				})
			},

			switch() {
				this.$ = !this.$;
				return this;
			},

			not() {
				return this.into($ => !$)
			},

			bool() {
				return this.into($ => !!$)
			},

			toString(_, base) {
				return this.into($ => Number($).toString(base))
			},

			publish(buffer) {
				const symbol = Symbol(buffer[3]);
				publishedPtr[symbol] = this;
				return symbol;
			},

			text() {
				const text = new Text(this.$);
				this.watch($ => text.textContent = $);
				return [text]
			}
		},

		...Object.keys(boolOps).map(op => ({
			[op](_, value) {

				const
					isPtrCache = isPtr(value),
					boolOp = boolOps[op],
					ptr = this.into($ => boolOp($, isPtrCache ? value.$ : value))
				;

				isPtrCache ? value.watch($ => ptr.$ = boolOp(this.$, $)) : 0;

				return ptr;

			}
		}))

	),

	isPtr = (ptr) => ptr?.[PTR_IDENTIFIER],

	createPtr = (value, setter = $ => $, options = {}) => {

		const
			watchers = [],
			watcherInfo = new WeakMap(),
			formattedOptions = Object.assign({ name: "$" }, options),
			execWatcher = function (value, force, ptr) {
				force || (value !== buffer[0])
					? (buffer[0] = value, watchers.forEach(fn => watcherInfo.get(fn)?.[1] ? fn(value) : 0))
					: 0
				;
				return ptr;
			},
			buffer = [
				value,
				watchers,
				watcherInfo,
				signature + (options.name || ""),
			]
		;

		return new Proxy(

			Object.defineProperties(Object(function(...args) {

				const [tmp] = buffer;

				return typeof tmp == "function" ? tmp.apply(null, args) : tmp;

			}), { name: { value: formattedOptions.name } }),

			{
				get(_, prop, reciever) {

					const [tmp] = buffer;

					let buf = (
						prop === "$" ? tmp
						: prop === "refresh" ? execWatcher.bind(null, tmp, !0, reciever)
						: prop === PTR_IDENTIFIER ? !0
						: (opTemp[prop]?.bind?.(reciever, buffer) || (
							typeof tmp[prop] != "function"
								? reciever.into($ => $[prop])
								: UNDEFINED
						))
					);

					if(buf === UNDEFINED) {
						const ptrBuf = createPtr()
						buf = function(...args) {
							reciever.watch($ => ptrBuf.$ = $[prop](...args))
							const argMap = args.map((arg, i) => isPtr(arg)
								? (arg.watch($ => (argMap[i] = $, ptrBuf.$ = reciever.$[prop](...argMap))), arg.$)
								: arg
							);
							ptrBuf.$ = tmp[prop].apply(tmp, argMap)
							return ptrBuf
						};
					};

					return buf;

				},
				set(_, prop, newValue) {
					if(prop == "$") {
						const tmp = setter(newValue);
						tmp instanceof Promise ? tmp.then(execWatcher) : execWatcher(tmp)
					}
					return !0;
				}
			}

		)
	},
	$ = (s, ...v) => createPtr(s, ...v)
;

let signature;

while((signature = String.fromCharCode(...resolverSignatureGenCB())) in globalThis);

Object.defineProperty(globalThis, signature, {
	value: (symbol) => publishedPtr[symbol],
	configurable: !1,
	enumerable: !1
});

/**
 * 
 * @param { number | string | any[] } value 
 * @param { Function } setterFn 
 * @param { object } options 
 * @returns { object }
 */
export { $, isPtr };