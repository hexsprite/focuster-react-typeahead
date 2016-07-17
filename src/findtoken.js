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
  if (tokenIndex != -1) {
    // break on space
    const hasSpaces = input.slice(tokenIndex + 1).lastIndexOf(' ');
    if (hasSpaces == -1) {
      value = input.slice(tokenIndex + 1);
    }
  }

  return {
    value,
    token
  }
}
