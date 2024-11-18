
const { assign: Object_assign } = Object;

const
	{ toPrimitive: Symbol_toPrimitive, dispose: Symbol_dispose } = Symbol,
	ESC_REGEX = /["&'<>`]/g,
	ESC_CHARCODE_BUF = {},
	ESC_FN = (match) => "&#x" + (ESC_CHARCODE_BUF[match] ||= match.charCodeAt(0).toString(16)) + ";",
	initTasks = {}
;

let elementName;

const OBJ_PROTO = Reflect.getPrototypeOf({});

const
	generateToken = () => Math.floor(Math.random() * 36) + 97,
	generatorTemp = { length: 6 }
;

const resolveTemp = (v) => {

}

const isPtr = (ptr) => {
	const sym = ptr[Symbol_toPrimitive]?.();
	return globalThis[sym?.description?.slice(0, 16)]?.(sym) === ptr;
}

const resolveFrag = ({ s, v }, cmd = []) => {
	cmd.push([0, s[0], undefined]);
	v.forEach((vBuf, vIndex) => {
		cmd.push([
			vBuf[Symbol_toPrimitive]?.(STRIX_HTML_IDENTIFIER) === 0
			? (resolveFrag(vBuf, cmd), 0)
			: (isPtr(vBuf))
			? 1
			: vBuf.constuctor === Object
			? 2
			: 3
		, s[vIndex + 1], vBuf])
	})
	return cmd;
}

const structFrag = ({ s, v }, str = [], val = []) => {
	str[str.length - 1] += s[0];
	val.push(v[0])
	v.forEach((vBuf, vIndex) => {
		if(vBuf[Symbol_toPrimitive]?.(PTR_IDENTIFIER)) {
			structFrag(vBuf, str, val)
		}
		str.push(s[vIndex + 1])
		val.push(vBuf)
	})
}

const structTemp = (resolvedFrag, PARSER_UUID) => {
	let resultBuf;
	initTasks[PARSER_UUID] = (initTarget) => {
		initTarget.getAttribute(PARSER_UUID)
	}
	resolvedFrag.forEach(([CMD, TEMP_STR, TEMP_VAL], CMD_INDEX) => {
		tempBuf +=
			CMD == 0
			? TEMP_STR
			: CMD == 1
			? `<br ${PARSER_UUID}="ptr" ${PTR_PARSER_TOKEN}="${CMD_INDEX}" hidden>${TEMP_VAL.$}<!---->${TEMP_STR}`
			: CMD == 2
			? ` ${PARSER_UUID}="attr" ${ATTR_PARSER_TOKEN}-${CMD_INDEX}="${CMD_INDEX}"${TEMP_STR}`
			: CMD == 3
			? (TEMP_VAL + '').replace(ESC_REGEX, ESC_FN) + TEMP_STR
			: ''
	});
	return resultBuf;
}

// ihasq/h ❤ lit-html's textEndRegex
const attrExt = new RegExp(`<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))[\\s].*\\0`, "g");
const nullExtAll = /\0/g;
const nullExt = /\0/;
const escExt = /\\((u\d{4})|(x[A-Fa-f0-9]{2})|(c[A-Za-Z])|([0\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/])|([fnrtv]))/g

const PTR_IDENTIFIER = Symbol();

const df = document.createDocumentFragment();

const fragmentTemp = {
	then(onloadCallbackFn) {
		Object_assign(this, { onloadCallbackFn });
		delete this.then;
		return this;
	},
	[Symbol_toPrimitive](hint) {
		return hint === PTR_IDENTIFIER
	},
	[Symbol.iterator]: function* () {
		const str = [""], val = [];
		structFrag(this, str, val);
		let joined = str.join("\0");
		let buf;
		while(joined.includes("-" + (buf = String.fromCharCode.apply(null, Array.from(generatorTemp, generateToken))))) {}
		const attrMatch = joined.matchAll(attrExt).map(({ index }) => index);
		
		joined.matchAll(nullExtAll).forEach(({ index }) => {
			joined = joined.replace(
				nullExt,
				attrMatch.includes(index)
				? ` h-${buf}="${index}" `
				: "number string".includes(typeof val[index])
				? val[index]
				: "<!--" + buf + "-->" + val[index].$ + "<!--" + buf + "-->"
			)
		});
		joined = joined.replaceAll(escExt, () => {

		});
		df.innerHTML = joined;
		df.childNodes.forEach(childNode => yield childNode);
	}
}

export const h = (s, ...v) => Object_assign({ s, v }, fragmentTemp);


function Component() {

	const count = $(0);

	return html`
		<button ${{ [on.click]: () => count.$++ }}>
			I got clicked ${count} times!
		</button>
	`
}

[document.body] = html`
	<body>
		${Component()}
	</body>
`;

// $