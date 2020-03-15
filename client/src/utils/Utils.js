const MAX_INDEX = 40;
const Utils = {
	indexValidator: value => {
		const validationResult = {
			error: false,
			errorMessage: null
		};
		if (Utils.isBlank(value)) {
			return validationResult;
		}

		const index = parseInt(value);
		if (index > MAX_INDEX) {
			validationResult.error = true;
			validationResult.errorMessage = `${index} is too high, index must be smaller than ${MAX_INDEX}`;
			return validationResult;
		}

		if (isNaN(index)) {
			validationResult.error = true;
			validationResult.errorMessage = 'Must be an integer';
			return validationResult;
		}
		return validationResult;
	},
	isBlank: str => !str || /^\s*$/.test(str)
};

export default Utils;
