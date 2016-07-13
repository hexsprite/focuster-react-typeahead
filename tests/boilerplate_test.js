import findToken from '../src/findtoken';
import completeChoice from '../src/completion';
// import {
//   renderIntoDocument,
//   findRenderedDOMComponentWithClass,
//   findRenderedDOMComponentWithTag,
//   Simulate
//} from 'react-addons-test-utils';

describe('findToken', function() {
  it('parses single token at EOL', function() {
    // expect(findToken).to.equal(1);
    let result = findToken('#f', 2);
    expect(result).to.deep.equal({
      value: 'f',
      token: '#'
    });
  });

  it('parses multiple tokens at EOL', function() {
    // expect(findToken).to.equal(1);
    let result = findToken('#etc foo #bar', 13);
    expect(result.value).to.equal('bar');
    expect(result).to.deep.equal({
      value: 'bar',
      token: '#'
    });
  })

  it('doesnt find token when theres a space', function() {
    let result = findToken('#apple ', 13);
    expect(result.value).to.equal(undefined);
  });

  describe('completeChoice', function() {
    it('completes at EOL', function() {
      let result = completeChoice('#ap', 3, 'ap', 'apple');
      expect(result).to.equal('#apple ');
    });

    it('completes in middle of line', function() {
      let result = completeChoice('#ap #ed', 3, 'ap', 'apple');
      expect(result).to.equal('#apple  #ed');
    });

  });
});
