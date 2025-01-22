import { argv, cwd } from "node:process";
import { readFileSync } from "node:fs";

switch(argv.length) {
	case 0: {
		break;
	}
	case 1: {
		// process as filePath
		const [filePath] = argv;
		readFileSync(new URL(filePath, cwd()).pathname).toString();

		// search blank port
		
		break;
	}
}