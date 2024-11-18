# h

```javascript
import { $, h as html, on } from "jsr:@ihasq/h"

function Component() {

	const count = $(0);

	return html`
		<h1>Count is ${count}</h1>
		<button ${{ [on.click]: () => count.$++ }}>
			Add more!
		</button>;
	`
}

document.body.innerHTML = Component();
```