# eos_contract_test
eos contract test simple framework on local chain instance.

it will boot a chain privately with some eosio contracts, then create custome accounts,
then build and deploy your custom contract, finally create eosjs instance to run the test cases

### install

```
cd your_working_dir

git clone https://github.com/cryptokylin/eos_contract_test.git

cd eos_contract_test

npm install
```

### config
For convenience, this repository already contains wallet (keys imported) named 'localtest' and example contract.
You can customize them by editing test/config.js if you want.

Before you can run the test, set SYS_CONTRACTS_FOLDER in test/config.js to point to the eosio source build contract folder
(something like: 'some_path/eos/build/contracts/'). This is neccessary for booting the chain
example:
```
  ...
  
  // --- define the contract folder from the build of the eosio source code
  SYS_CONTRACTS_FOLDER: '/home/shenghua/projects/source/eos/build/contracts/',
  
  ...
```
### running options
After test/config.js ready, run
```
npm test :h
```
will give you
```
usage: npm test [OPTIONS] 

Options:
  :bc(:build-contracts)      build your custom contracts before deployment, you can define your custom contracts in "config.js" 
  :s(:snap) <snapname>       snapshot chain data, you can define snap point in file "main.js" 
  :l(:load) <snapname>       load snapped chain data, then boot. The snapped data saved in "snapshot" folder 
  :nd(:no-deploy)            disable custom contracts deployment 
  :h(:help)                  show help 

```

### first time run
For the first time run, you need to build your custom contracts before deployment, run following
```
npm test :bc
```
If everything goes well, you will see the progress like this:
```
----------------------------------------------------
--- start booting chain ...
cleaning previous chain data ...
starting keosd ...
unlocking wallet ...
starting nodeos ...
deploying eosio.bios contract ...
creating system accounts:  [ 'eosio.bpay',
  'eosio.msig',
  'eosio.names',
  'eosio.ram',
  'eosio.ramfee',
  'eosio.saving',
  'eosio.stake',
  'eosio.token',
  'eosio.vpay' ]
deploying eosio.token contract ...
deploying eosio.msig contract ...
creating token:  SYS
issuing token:  SYS
setting eosio.msig privilege ...
deploying eosio.system contract ...
buying ram for eosio ...
delegating net and cpu for eosio ...


----------------------------------------------------
--- creating custome contract owner accounts (their keys already imported into wallet) ...
creating account: contract1111
creating account: contract2222


----------------------------------------------------
--- building contracts ...
building contract: btc.token
building btc.token.wast ...
building btc.token.abi ...
generating btc.token.wasm ...
exec: terminate called after throwing an instance of 'std::bad_alloc'
  what():  std::bad_alloc
Aborted (core dumped)

<Error> terminate called after throwing an instance of 'std::bad_alloc'
  what():  std::bad_alloc
Aborted (core dumped)



----------------------------------------------------
--- deploying contracts ...
deploying contract: btc.token


----------------------------------------------------
--- setting up eosjs ...
--- saving private keys for eosjs config ...
saving key for account: eosio
saving key for account: contract1111
saving key for account: contract2222
eosjs ready.


  BTC contract
----------------------------------------------------
--- total num of cases: 3


----------------- running cases --------------------
    ✓ create 2,000,000 and issue 500,000 BTC (395ms)
    ✓ transfer 500,000 BTC from contract1111 to contract2222 (245ms)
(node:19607) UnhandledPromiseRejectionWarning: AssertionError: expected '["500000.0000 BTC"]' to equal '["500001.0000 BTC"]'
    at eos.api.getCurrencyBalance.then (/home/shenghua/projects/node_projects/eos_test_case/test/testcases.js:93:16)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
(node:19607) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:19607) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
    1) supposed to fail: transfer 1 more BTC from contract1111 to contract2222


-------------------- report ------------------------


  2 passing (3s)
  1 failing

  1) BTC contract
       supposed to fail: transfer 1 more BTC from contract1111 to contract2222:
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/home/shenghua/projects/node_projects/eos_test_case/test/main.js)
  
```
This shows 3 cases run, 2 of them passing and 1 failing

### snap and load chain data
To boot a fresh chain is time costing, you can use the following option to save a chain snap
```
npm test :s mysnap
```
Later you can quickly boot a chain from your snapped data by:
```
npm test :l mysnap
```
Open test/main.js, you can define your own snap and load logic accordingly

### test cases

Last but not least, please write your test cases in test/testcases.js, in following format

```
// ----------------------------------------------------
// case No.
add_test('testcase description', (done) => {
  // write you test logic
  ...
});
```
For more information about how to write test assertion please find help on

https://mochajs.org

http://www.chaijs.com/guide/styles/#assert

