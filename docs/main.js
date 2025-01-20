import { $, h as html, on, css } from "libh";

/**
 * 
 * @param {{ src: string, alt: string, href: string }} param0 
 * @returns 
 */
function Badge({ src, alt, href }) {
	return html`
		<a ${{ href, target: "_blank", [css.textDecoration]: "none" }}><img ${{ src, alt }}></a>
	`;
}

export default function() {
	return html`
		<div ${{
			[css]: {
				boxSizing: "border-box",
				padding: "60px calc(20% - 60px)",
				fontFamily: "int"
			}
		}}>

			<h1 ${{
				[css.margin]: "40px 0",
				[css.fontFamily]: 'jbm'
			}}>
				&lt;<a ${{ href: "https://libh.js.org", [css.textDecoration]: "none" }}>libh</a>&gt;
			</h1>

			<div ${{ [css.margin]: "0 0 20px" }}>
				<a ${{ href: "https://github.com/ihasq/libh", target: "_blank" }}>GitHub</a>
				<a ${{ href: "https://stackblitz.com/edit/vitejs-vite-vcga6uwx?file=main.js", target: "_blank" }}>StackBlitz</a>
			</div>

			<div ${{ [css.margin]: "0 0 20px" }}>
				${Badge({
					src: "https://img.shields.io/npm/v/libh?logo=npm&color=%23CC3534", 
					alt: "npm version badge",
					href: "https://npmjs.com/package/libh"
				})}
				${Badge({
					src: "https://img.shields.io/bundlejs/size/libh?logo=stackblitz",
					alt: "npm package minimized gzipped size",
					href: "https://bundlephobia.com/package/libh"
				})}
			</div>

			<div ${{ [css.margin]: "40px 0 0" }}>libh is a minimal JavaScript library to build simple, reactive, extensible web interface.</div>

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

				libh is <a ${{ href: "https://www.wtfpl.net" }}>WTFPL licensed</a>.
			</div>


		</div>
	`;
}