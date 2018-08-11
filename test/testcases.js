
const assert = require('chai').assert;
const expect = require('chai').expect;
// const should = require('chai').should;

createTestCases = function(eos) {

// array store all test cases
var testcases = [];
add_test = function(desc, func) {
  testcases.push( { desc: desc, func: func } );
}

// ====================================================
// --- testcase begining
// ====================================================

// ----------------------------------------------------
// case 1
add_test('create 2,000,000 and issue 500,000 BTC', (done) => {
  eos.api.transaction(
    {
      actions: [
        eos.makeAction('contract1111', 'create', {  issuer: 'contract1111',
                                                    maximum_supply: '2000000.0000 BTC'} ),
        eos.makeAction('contract1111', 'issue', {   to: 'contract1111',
                                                    quantity: '500000.0000 BTC',
                                                    memo: 'Wow! I am rich' } )
      ]
    },
    { expireInSeconds: 60, broadcast: true, sign: true },
    (err, result) => {
      expect(err).to.not.exist;
      eos.api.getCurrencyBalance('contract1111', 'contract1111', 'BTC')
      .then( (asset) => {
        expect(asset).to.be.an('array');
        assert.equal(JSON.stringify(asset), JSON.stringify([ '500000.0000 BTC' ]));
        done();
      });
    }
  );
});

// ----------------------------------------------------
// case 2
add_test('transfer 500,000 BTC from contract1111 to contract2222', (done) => {
  eos.api.transaction(
    {
      actions: [
        eos.makeAction('contract1111', 'transfer', {  from: 'contract1111',
                                                      to: 'contract2222',
                                                      quantity: '500000.0000 BTC',
                                                      memo: 'produce a billionare' } )
      ]
    },
    { expireInSeconds: 60, broadcast: true, sign: true },
    (err, result) => {
      expect(err).to.not.exist;
      eos.api.getCurrencyBalance('contract1111', 'contract2222', 'BTC')
      .then( (asset) => {
        expect(asset).to.be.an('array');
        assert.equal(JSON.stringify(asset), JSON.stringify([ '500000.0000 BTC' ]));
        // done();
        eos.api.getCurrencyBalance('contract1111', 'contract1111', 'BTC')
        .then( (asset) => {
          expect(asset).to.be.an('array');
          assert.equal(JSON.stringify(asset), JSON.stringify([])); // 0 token return empty
          done();
        });
      });
    }
  );
});


// ----------------------------------------------------
// case 3
add_test('supposed to fail: transfer 1 more BTC from contract1111 to contract2222', (done) => {
  eos.api.transaction(
    {
      actions: [
        eos.makeAction('contract1111', 'transfer', {  from: 'contract1111',
                                                      to: 'contract2222',
                                                      quantity: '1.0000 BTC',
                                                      memo: 'one more ...' } )
      ]
    },
    { expireInSeconds: 60, broadcast: true, sign: true },
    (err, result) => {
      expect(err).to.exist; // eosjs return err here
      eos.api.getCurrencyBalance('contract1111', 'contract2222', 'BTC')
      .then( (asset) => {
        assert.equal(JSON.stringify(asset), JSON.stringify([ '500001.0000 BTC' ]));
        done();
      });
    }
  );
});


// ====================================================
// --- testcase end
// ====================================================

return testcases;
}


runTestCases = function(testcases, flags) {
  describe('BTC contract', function() {
    before(function() {
      console.log('----------------------------------------------------');
      console.log('---', 'total num of cases: ' + testcases.length);
      console.log('\n');
      console.log('----------------- running cases --------------------');
    });
    after(function() {
      flags.finished = true;
      console.log('\n');
      console.log('-------------------- report ------------------------');
    })

    // test cases
    testcases.forEach( (testcase) => {
      it(testcase.desc, testcase.func);
    });
  });
}

module.exports.createTestCases = createTestCases;
module.exports.runTestCases = runTestCases;
