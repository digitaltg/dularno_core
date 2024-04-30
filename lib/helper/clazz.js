/**
 * Gat class instance methods
 * @param {*} clazz 
 * @returns 
 */
function getClassMethods(clazz) {
  const props = [];
  let obj = clazz;
  props.push(...Object.getOwnPropertyNames(Object.getPrototypeOf(obj)));

  return props.sort().filter((e, i, arr) => {
    if (['constructor'].includes(e)) return false;

    if (e != arr[i + 1] && typeof clazz[e] == 'function') return true;
  });
}


function getParams(func, nonDefault = false) {

  // String representation of the function code
  let str = func.toString();
  str = str.replace('\n', '')

  // Remove comments of the form /* ... */
  // Removing comments of the form //
  // Remove body of the function { ... }
  // removing '=>' if func is arrow function 
  str = str.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/(.)*/g, '')
    .replace(/{[\s\S]*}/, '')
    .replace(/=>/g, '')
    .trim();

  // Start parameter names after first '('
  let start = str.indexOf("(") + 1;

  // End parameter names is just before last ')'
  let end = str.length - 1;

  let result = str.substring(start, end).split(", ");

  let params = [];

  result.forEach(element => {

    if (nonDefault) {
      // Removing any default value
      element = element.replace(/=[\s\S]*/g, '').trim();
      if (element.length > 0)
        params.push(element);
    } else {
      element.split(",").map(t => t.trim()).forEach(el => {
        let [param, value] = el.split("=").map(t => t.trim());
        if (value) {
          value = `${value}`.replace(/'/g, '');
          if (param.length > 0)
            params.push({ param, value });
        }
      });

    }
  });

  if (nonDefault == false) {
    params = params.reduce((obj, item) => ({
      ...obj,
      [item.param]: item.value
    }), {});
  }

  return params;
}

module.exports.getClassMethods = getClassMethods;
module.exports.getParams = getParams;