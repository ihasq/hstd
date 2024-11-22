const
	tokenGenerator = function*(length = 16) {
		for(let i = 0; i < length; i++) {
			yield Math.floor(Math.random() * 26) + 97
		}
	}
;

export const createToken = (length = 16) => String.fromCharCode(...tokenGenerator(length))