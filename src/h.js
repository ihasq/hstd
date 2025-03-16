const

	TOKEN_LENGTH = 16,

	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),
	HTML_IDENTIFIER = Symbol.for("HTML_IDENTIFIER"),

	createToken = function*(length = TOKEN_LENGTH) {
		for(let i = 0; i < length; i++) {
			yield Math.floor(Math.random() * 26) + 97
		}
	},

	elementTempMap = new WeakMap(),

	df = document.createDocumentFragment(),

	fragmentTemp = {
		[Symbol.toPrimitive](hint) {
			return typeof hint == "string" ? [...this[Symbol.iterator]().map(element => element.outerHTML)].join("") : hint === HTML_IDENTIFIER
		},
		toString() {
			return this[Symbol.toPrimitive]("string")
		}
	},

	refProxyHandler = {
		get(target, prop) {
			const targetValue = target[prop];
			return (
				typeof targetValue == "function" &&
				targetValue.toString().endsWith("() { [native code] }")
			)
				? targetValue.bind(target)
				: targetValue
			;
		}
	},

	isPtr = (maybePtr) => maybePtr?.[Symbol.toPrimitive]?.(PTR_IDENTIFIER)
;

/**
 * @param { TemplateStringsArray } s
 * @param { (string | number | { [key: (string | symbol)]: any })[] } v
 * 
 * @returns { NodeList }
 */

export const h = (s, ...v) => {

	let elementTemp = elementTempMap.get(s);

	if(!elementTemp) {

		let joined = s.join(""), tokenBuf, replacementCounter = 0;
		while(joined.includes(tokenBuf = String.fromCharCode(...createToken()))) {};
		joined = s.join(tokenBuf);

		const
			attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*?${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length)),
			placeholder = [],
			node = document.createElement("div"),
			vLength = v.length
		;

		df.appendChild(node);

		node.innerHTML = joined.replaceAll(tokenBuf, (_, index) => (placeholder[replacementCounter++] = attrMatch.includes(index + TOKEN_LENGTH)) ? tokenBuf : `<br ${tokenBuf}>`);

		elementTempMap.set(s, elementTemp = [node, placeholder, tokenBuf])
	};

	const
		[node, placeholder, tokenBuf] = elementTemp,
		newNode = node.cloneNode(true),
		id = {}
	;

	newNode.querySelectorAll(`[${tokenBuf}]`).forEach((ref, index) => {

		const vBody = v[index];

		if(placeholder[index]) {

			const attrResolve = function(attrBody, attrProp) {

				const
					attrValue = attrBody[attrProp],
					attrPropType = typeof attrProp
				;

				console.log(attrPropType)

				if(attrPropType == "symbol") {

					const attrPtr = globalThis[attrProp.description.slice(0, 52)]?.(attrProp);

					if(!isPtr(attrPtr)) return;
					
					const buf = attrPtr.$(attrValue, ref);


					if(typeof buf != "object") return;

					Reflect.ownKeys(buf).forEach(attrResolve.bind(!1, buf));

				} else if(attrPropType == "string") {

					if(isPtr(attrValue)) {

						if("value\0checked".includes(attrProp) && attrProp in ref) {

							ref[attrProp] = attrValue.$;
							const oninput = $ => ref[attrProp] = $;
							attrValue.watch(oninput);

							ref.addEventListener("input", ({ target: { [attrProp]: value } }) => setTimeout(() => {

								attrValue.ignore.set(oninput);
								attrValue.$ = value
								attrValue.ignore.delete(oninput);

							}), { passive: true })

						} else {

							ref[attrProp] = attrValue.$
							attrValue.watch(newAttrValue => ref[attrProp] = newAttrValue)

						}

					} else if(attrProp == "id" && !(attrValue in id)) {

						id[attrValue] = new Proxy(ref, refProxyHandler);

					} else {

						ref[attrProp] = attrValue;

					}
				}
			}

			Reflect.ownKeys(vBody).forEach(attrResolve.bind(!1, vBody));

		} else {

			ref.replaceWith(...(vBody[Symbol.toPrimitive]?.(HTML_IDENTIFIER) ? vBody : isPtr(vBody) ? vBody.text() : [new Text(vBody)]));

		}

		ref.removeAttribute(tokenBuf);
	});

	return Object.assign(

		newNode.childNodes,
		fragmentTemp,
		{
			then(onloadCallbackFn) {
				onloadCallbackFn(id);
				return this;
			}
		}

	);
};