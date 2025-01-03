# 🐛 lib[h](https://libh.js.org)
[![NPM Version](https://img.shields.io/npm/v/libh)](https://www.npmjs.com/package/libh)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/libh)](https://bundlephobia.com/package/libh)

```javascript
// get ingredients

import { $, h as html, on } from "libh"


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

Visit live [demo](https://ihasq.com/libh/demo/count).

## Install
```sh
npm i libh
```

## Example

### Class-model
```javascript
import { $, h as html, on, css } from "libh"

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