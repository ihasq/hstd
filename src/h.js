import { isPtr } from "./$.js";
import { aEL } from "./on.js";

const

	TOKEN_LENGTH = 16,
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
			return (
				typeof hint == "string"
					? [...this[Symbol.iterator]().map(element => element.outerHTML)].join("")
					: hint === HTML_IDENTIFIER
			)
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

	bindResolver = (t, attrBody) => Reflect.ownKeys(attrBody).forEach(attrResolve.bind(null, t, attrBody)),

	attrResolve = function(t, attrBody, attrProp) {

		const
			[id, ref] = t,
			attrValue = attrBody[attrProp],
			attrPropType = typeof attrProp
		;

		if(attrPropType == "symbol") {

			const attrPtr = globalThis[attrProp.description.slice(0, 52)]?.(attrProp);

			if(!isPtr(attrPtr)) return;
			
			const buf = attrPtr.$(attrValue, ref);

			if(buf?.constructor !== Object) return;

			bindResolver(t, buf);

		} else if(attrPropType == "string") {

			if(isPtr(attrValue)) {

				ref[attrProp] = attrValue.watch($ => ref[attrProp] = $).$;

				if("\0value\0checked\0".includes(`\0${attrProp}\0`) && attrProp in ref) aEL(
					"input",
					({ target: { [attrProp]: value } }) => attrValue.$ = (
						"number\0range".includes(ref.type)
							? Number(value)
							: value
					),
					ref
				);

			} else if(attrProp == "id" && !(attrValue in id)) {

				id[attrValue] = new Proxy(ref, refProxyHandler);

			} else {

				ref[attrProp] = attrValue;

			}
		}
	},

	queryResolve = function(placeholder, tokenBuf, v, id, ref, index) {

		const vBody = v[index];

		if(placeholder[index]) {

			bindResolver([id, ref], vBody);

		} else {

			ref.replaceWith(...(
				vBody[Symbol.toPrimitive]?.(HTML_IDENTIFIER)	? vBody
				: isPtr(vBody)									? vBody.text()
				:												[new Text(vBody)]
			));

		}

		ref.removeAttribute(tokenBuf);
	},

	elementTempBase = function (node, placeholder, fragmentTemp, tokenBuf, v) {

		const
			newNode = node.cloneNode(!0),
			id = {}
		;
		
		newNode.querySelectorAll(`[${tokenBuf}]`).forEach(queryResolve.bind(null, placeholder, tokenBuf, v, id));

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
	}
;

/**
 * @param { TemplateStringsArray } s
 * @param { (string | number | { [key: (string | symbol)]: any })[] } v
 * 
 * @returns { NodeList }
 */

export const h = (s, ...v) => {

	let createElementTemp = elementTempMap.get(s);

	if(!createElementTemp) {

		let
			joined = s.join(""),
			replacementCounter = 0,
			tokenBuf
		;

		while(joined.includes(tokenBuf = String.fromCharCode(...createToken())));

		joined = s.join(tokenBuf);

		const
			attrMatch = [...joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*?${tokenBuf}`, "g"))]
				.map(({ 0: { length }, index }) => index + length)
			,
			placeholder = [],
			node = document.createElement("div")
		;

		df.appendChild(node);

		node.innerHTML = joined.replaceAll(
			tokenBuf,
			(_, index) => (placeholder[replacementCounter++] = attrMatch.includes(index + TOKEN_LENGTH))
				? tokenBuf
				: `<br ${tokenBuf}>`
		);

		elementTempMap.set(s, createElementTemp = elementTempBase.bind(null, node, placeholder, fragmentTemp, tokenBuf))
	};

	return createElementTemp(v)
};