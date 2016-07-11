/*
 input: string of the value eg '#foo #bar'
 position: cursor position (int) within the value eg. 5
*/

export default function findToken(input, position) {
  // work our way backwards looking for a certain character
  let value;
  const token = '#';

  // we only look at what's happening where the cursor position
  input = input.slice(0, position);
  const tokenIndex = input.lastIndexOf(token);
  console.log(input, position, tokenIndex)
  if (tokenIndex != -1) {
    // break on space
    const hasSpaces = input.slice(tokenIndex + 1).lastIndexOf(' ');
    // console.log(hasSpaces);
    if (hasSpaces == -1) {
      // console.log('no spaces', tokenIndex + 1);
      value = input.slice(tokenIndex + 1);
    }
  }

  // console.log(value);
  return {
    value,
    token
  }
}
