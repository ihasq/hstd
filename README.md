# 🐛 lib[h](https://libh.js.org)

```javascript
// import some shitlets

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
