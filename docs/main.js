import { h as html, on, css } from "libh";
/**
 * 
 * @param { string } href
 * @param { HTMLCollection | string } child
 * @returns { HTMLCollection }
 */
function Link(href, child) {
	return html`<a ${{
		href,
		target: "_blank",
		[css]: {
			color: "#0203ff",
			textDecoration: "none"
		}
	}}>${child}</a>`;
}

/**
 * 
 * @param { string } src
 * @param { string } alt
 * @param { string } href
 * @returns { HTMLCollection }
 */
function Badge(src, alt, href) {
	return Link(href, html`
		<img ${{ src, alt }}>
	`);
}


export default function() {
	return html`
		<div ${{
			[css]: {
				boxSizing: "border-box",
				padding: "60px calc(20% - 60px)",
				fontFamily: "int"
			},
		}}>

			<h1 ${{
				[css.margin]: "40px 0",
				[css.fontFamily]: 'jbm'
			}}>
				lib${Link("https://libh.js.org", "h")}
			</h1>

			<div ${{ [css.margin]: "0 0 20px" }}>
				${Link("https://github.com/ihasq/libh", "GitHub")}
				${Link("https://stackblitz.com/edit/vitejs-vite-vcga6uwx?file=main.js", "StackBlitz")}
			</div>

			<div ${{ [css.margin]: "0 0 20px" }}>
				${Badge("https://img.shields.io/npm/v/libh?logo=npm&color=%23CC3534", "npm version badge", "https://npmjs.com/package/libh")}
				${Badge("https://img.shields.io/bundlejs/size/libh?logo=stackblitz", "npm package minimized gzipped size", "https://bundlephobia.com/package/libh")}
			</div>

			<div ${{ [css.margin]: "40px 0 0" }}>
				libh is a minimal JavaScript library to build simple, reactive, extensible web interface. 
			</div>

			<div ${{ [css.margin]: "20px 0 0" }}>
				${Link("https://github.com/ihasq/libh/tree/main/docs/main.js", "source")} of this page is available.
			</div>

			<div ${{ [css.margin]: "60px 0" }}>
				<h2 ${{ [css.fontFamily]: 'jbm' }}>Install</h2>

				<code ${{
					[css]: {
						display: "block",
						backgroundColor: "#02030f",
						color: "#a2a3bf",
						margin: "30px 0",
						borderRadius: "4px",
						width: "40%",
						userSelect: "none",

						padding: "16px 20px",
						fontSize: "16px"
					},
					[on.click]() {
						navigator.clipboard.writeText("npm i libh")
					}
				}}>$ <span ${{ [css.color]: "#f2f3ff" }}>npm i libh<span></code>
			</div>

			<div ${{ [css.margin]: "60px 0" }}>
				<h2 ${{ [css.fontFamily]: 'jbm' }}>License</h2>

				libh is ${Link("https://www.wtfpl.net", "WTFPL licensed")}.
			</div>

	`;
}