module.exports = function(res, code, data = {}) {
	res.status(code);
	res.json(data);
}