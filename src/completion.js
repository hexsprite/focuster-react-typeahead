/* given a current input value with the cursor at a certain position,
   replace the current token with the given choice */
export default function completeChoice(value, position, token, choice) {
  let tokenStart = position - token.length;
  let start = value.slice(0, tokenStart);
  let end = value.slice(position);
  value = start + choice + ' ' + end;
  console.log(start, choice, end);
  console.log('new value: ', value);
  return value;

  // let input = this.input;
  // let value = input.value.slice(0, input.selectionEnd);
  // let fragment = value.slice(value.lastIndexOf('#') + 1);
  // let match = this.matches()[0];
  // let lastTokenIndex = this.input.value.lastIndexOf('#');
  // let before = this.input.value.slice(0, input.selectionEnd - fragment.length);
  // let after = value.slice(input.selectionEnd + fragment.length + 1);
  // value = before + match + ' ' + after;
  // console.log('new value: ', value);
  // return value;
}
