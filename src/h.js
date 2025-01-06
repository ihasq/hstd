// ihasq/h ❤ lit-html's textEndRegex ❤

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
	fragElementMap = new WeakMap(),

	transformFrag = (frag) => {

		const { s, v, f } = frag;

		let elementTemp = elementTempMap.get(s);

		if(!elementTemp) {

			let joined = s.join(""), tokenBuf;
			while(joined.includes(tokenBuf = String.fromCharCode(...createToken()))) {};
			joined = s.join(tokenBuf);

			const
				attrMatch = Array.from(joined.matchAll(new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*?${tokenBuf}`, "g")).map(({ 0: { length }, index }) => index + length)),
				placeholder = {},
				node = document.createElement("div")
			;

			df.appendChild(node);

			node.innerHTML = joined.replaceAll(tokenBuf, (match, index) => {
				let id;
				while(joined.includes(id = String.fromCharCode(...createToken()))) {};
				return (placeholder[id] = attrMatch.includes(index + TOKEN_LENGTH)) ? id : `<br ${id}>` 
			});

			elementTempMap.set(s, elementTemp = { node, placeholder })
		};

		const
			{ node, placeholder } = elementTemp,
			newNode = node.cloneNode(true),
			idList = {}
		;

		Object.keys(placeholder).forEach((id, index) => {

			const
				ref = newNode.querySelector(`[${id}]`),
				attrBody = v[index]
			;

			if(placeholder[id]) {

				Reflect.ownKeys(attrBody).forEach(attrProp => {

					const
						attrValue = attrBody[attrProp],
						attrPropType = typeof attrProp
					;

					if(attrPropType == "symbol") {

						const ptr = globalThis[attrProp.description.slice(0, 52)]?.(attrProp);
						if(!ptr?.[Symbol.toPrimitive]?.(PTR_IDENTIFIER)) return;
						ptr.$(attrValue, ref);

					}
					if(attrPropType == "string") {

						if(attrValue[Symbol.toPrimitive]?.(PTR_IDENTIFIER)) {
							if(attrProp == "value" && ref instanceof HTMLInputElement) {
								const oninput = $ => ref.value = $;
								attrValue.watch(oninput);
								ref.addEventListener("input", ({ target: { value } }) => setTimeout(() => {
									attrValue.ignore.set(oninput);
									attrValue.$ = value
									attrValue.ignore.delete(oninput);
								}), { passive: true })
							} else {
								attrValue.watch($ => ref[attrProp] = $)
							}

						} else if(attrProp == "id" && !(attrValue in idList)) {
							idList[attrValue] = ref;
						} else {
							ref[attrProp] = attrValue;
						}
					}
				});

			} else {
				const primitiveDef = attrBody[Symbol.toPrimitive];
				if(primitiveDef?.(HTML_IDENTIFIER)) {
					ref.replaceWith(...transformFrag(attrBody))
				} else if(primitiveDef?.(PTR_IDENTIFIER)) {
					const txt = new Text("")
					attrBody.watch($ => txt.textContent = $);
					ref.replaceWith(txt)
				} else {
					ref.previousSibling.textContent += attrBody + (ref.nextSibling?.textContent || "")
					ref.nextSibling?.remove();
					ref.remove();
				}
			}

			ref.removeAttribute(id);
		});

		f?.(idList);

		fragElementMap.set(frag, newNode);

		return newNode.children;
	},

	df = document.createDocumentFragment(),

	fragmentTemp = {
		then(onloadCallbackFn) {
			if(!this.f) {
				this.f = onloadCallbackFn;
			}
			return this;
		},
		[Symbol.toPrimitive](hint) {
			return typeof hint == "string" ? HTML_IDENTIFIER : hint === HTML_IDENTIFIER
		},
		[Symbol.iterator]: function* () {
			for(const child of transformFrag(this)) yield child;
		}
	},
	h = (s, ...v) => Object.assign({ s, v }, fragmentTemp)
;

/**
 * 
 */
export { h }