# 🐛 [h](https://libh.js.org)std
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/vitejs-vite-vcga6uwx?file=main.js)
[![NPM Version](https://img.shields.io/npm/v/hstd?logo=npm&color=%23CC3534)](https://www.npmjs.com/package/hstd)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/hstd?logo=stackblitz)](https://bundlephobia.com/package/hstd)
```javascript
// get ingredients

import { $, h as html, on } from "hstd"


// cook yours

function Component() {

    const count = $(0);

    return html`
        <h1>Count is ${count}</h1>
        <button ${{ [on.click]: () => count.$++ }}>
            Add more!
        </button>
    `;
}


// throw into the DOM

document.body.append(...Component());
```

Visit live [demo](https://ihasq.com/hstd/demo/count).

---
- **[Install](#install)**
- **[Examples](#examples)**
- **[Demo](#demo)**
- **[License](#license)**

---

## Install
```sh
npm i hstd
```

## Download
```javascript
import { $, h as html } from "https://hstd.dev";
```

## Examples
**[Class-model](#class-model) | [Bidirecetional binding](#bidirecetional-binding) | [Post-processing](#post-processing)**

### Class-model
```javascript
import { $, h as html, on, css } from "hstd"

const ButtonClass = {
    [css]: {
        color: "white",
        backgroundColor: "blue",
    },
    [on.click]: () => alert("hi")
}

function Main() {

    const count = $(0);

    return html`
        <button ${{ [on.click]: () => count.$++, ...ButtonClass }}>
            I'm styled ${count}!
        </button>
    `
}
```

### Bidirecetional binding
```javascript
function Linked() {

    const valueHolder = $(0)

    return html`
        <h1>these are linked!</h1>
        <input ${{ value: valueHolder, type: "range" }}>
        <input ${{ value: valueHolder, type: "range" }}>
        <label>value is ${valueHolder}</label>
    `
}
```

### Post-processing
```javascript
function Canvas() {

    const colorSwitch = $(true);

    return html`
        <canvas ${{ id: "color", [on.click]: () => colorSwitch.switch() }}></canvas>

    `.then(({ color }) => {

        const ctx = color.getContext("2d");
        colorSwitch.into($ => $ ? "red" : "blue").watch($ => {
            ctx.fillStyle = $;
            ctx.fillRect(0, 0, 100, 100);
        });
    })
}
```

## Demo
+ [Passcore](https://ihasq.com/passcore) - Random Password Generator ([code](https://github.com/ihasq/passcore))

## License

libh is [WTFPL licensed](LICENSE).