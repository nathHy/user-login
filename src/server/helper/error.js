module.exports = function(msgOrError, code) {
	if (msgOrError instanceof Error) {
		msgOrError.code = code;
		return msgOrError;
	} else {
		let error = new Error(msgOrError);
		error.code = code;
		return error;
	}
}