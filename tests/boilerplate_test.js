import findToken from '../src/findtoken';

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
  });

});
