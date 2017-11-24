var self = module.exports = {
  // Parse options and return first value if second value is undefined
	get: (obj1, obj2) => { return typeof obj1 === "undefined" ? obj2 : obj1; }
}
