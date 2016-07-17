/* given a current input value with the cursor at a certain position,
   replace the current token with the given choice */
export default function completeChoice(value, position, token, choice) {
  let tokenStart = position - token.length;
  let start = value.slice(0, tokenStart);
  let end = value.slice(position);
  value = start + choice + ' ' + end;
  return value;
}
