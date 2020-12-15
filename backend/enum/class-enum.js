const class_text = ["NoClass", "a", "b", "c", "d", "e"];

let class_enums = {};
class_text.forEach((key, i) => (class_enums[key] = i));

module.exports = class_enums;
