/*
  if success: [data, undefined]
  if error: [undefined, error]
 */
const handle = (promise) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};

module.exports = handle;
