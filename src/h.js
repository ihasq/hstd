// ihasq/h ❤ lit-html's textEndRegex

const
	{ assign: Object_assign, freeze: Object_freeze } = Object,
	{ toPrimitive: Symbol_toPrimitive, dispose: Symbol_dispose, iterator: Symbol_iterator } = Symbol,

	ESC_REGEX = /["&'<>`]/g,
	ESC_CHARCODE_BUF = {},
	ESC_FN = (match) => "&#x" + (ESC_CHARCODE_BUF[match] ||= match.charCodeAt(0).toString(16)) + ";",

	TOKEN_LENGTH = 16,

	PTR_IDENTIFIER = Symbol.for("PTR_IDENTIFIER"),

	generateToken = () => Math.floor(Math.random() * 26) + 97,
	generatorTemp = { length: TOKEN_LENGTH },

	structFrag = ({ s, v }, str = [], val = []) => {
		str[str.length - 1] += s[0];
		v.forEach((vBuf, vIndex) => {
			if(vBuf[Symbol_toPrimitive]?.(PTR_IDENTIFIER)) {
				structFrag(vBuf, str, val)
				str[str.length - 1] += s[vIndex + 1]
			} else if("number string".includes(typeof vBuf)) {
				str[str.length - 1] += String(vBuf).replaceAll(ESC_REGEX, ESC_FN) + s[vIndex + 1]
			} else {
				val.push(vBuf)
				str.push(s[vIndex + 1])
			}
		})

	},

	df = document.createDocumentFragment(),
	tempDiv = document.createElement("div"),

	thisEval = new XPathEvaluator(),

	fragmentTemp = {
		then(onloadCallbackFn) {
			Object_assign(this, { onloadCallbackFn });
			delete this.then;
			return this;
		},
		[Symbol_toPrimitive](hint) {
			return hint === PTR_IDENTIFIER
		},
		[Symbol_iterator]: function* () {

			const
				str = [""],
				val = []
			;

			structFrag(this, str, val);

			let joined = str.join(""), tokenBuf;

			while(joined.includes(tokenBuf = String.fromCharCode.apply(null, Array.from(generatorTemp, generateToken))));

			joined = str.join(tokenBuf);

			const
				attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length)),
				attrIndex = [],
				ptrIndex = []
			;
			
			let attrCount = -1;
			tempDiv.innerHTML = joined.replaceAll(tokenBuf, (match, index, target) => (attrCount++, attrMatch.includes(index + TOKEN_LENGTH)
				? (attrIndex.push(attrCount), match)
				: (ptrIndex.push(attrCount), "<!--" + tokenBuf + "-->" + val[index].$ + "<!---->")
			));

			const ptrMatch = thisEval.evaluate(`//comment()[contains(., '${tokenBuf}')]`, tempDiv, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			
			let node, nodeIndex = 0;

			let ptrCount = 0
			while(node = ptrMatch.iterateNext()) {
				const ptrText = node.nextSibling();
				val[ptrIndex[ptrCount++]].watch($ => ptrText.textContent = $);
			}

			tempDiv.querySelectorAll(`[${tokenBuf}]`).forEach((attr, index) => {
				const attrBody = attrIndex[index];
				Reflect.ownKeys(val[attrBody]).forEach(attrProp => {
					if(typeof attrProp !== "symbol") return;
					const ptr = globalThis[attrProp.description.slice(0, 16)]?.(attrProp);
					if(!ptr?.[Symbol_toPrimitive]?.(PTR_IDENTIFIER)) return;
					ptr.$(attrBody[attr], attr)
				})
			});

			const { childNodes: tempNodes } = tempDiv;

			for(const tempNode of tempNodes) yield tempNode;

			return;
		}
	},
	h = (s, ...v) => Object_freeze(Object_assign({ s, v }, fragmentTemp))
;

df.appendChild(tempDiv);

export { h }