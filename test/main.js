
// ----------------------------------------------------
// shared functions
// ----------------------------------------------------
function printDiv(msg, appendNewline=true) {
  if (appendNewline) console.log('\n');
  console.log('----------------------------------------------------');
  console.log('---', msg);
}

cmdFormat =
  'usage: npm test [OPTIONS] \n\n' +
  'Options:\n' +
  '  :bc(:build-contracts)      build your custom contracts before deployment, you can define your custom contracts in "config.js" \n' +
  '  :s(:snap) <snapname>       snapshot chain data, you can define snap point in file "main.js" \n' +
  '  :l(:load) <snapname>       load snapped chain data, then boot. The snapped data saved in "snapshot" folder \n' +
  '  :nd(:no-deploy)            disable custom contracts deployment \n' +
  '  :h(:help)                  show help \n' +
  '';

function invalidArgsExit() {
  console.log('<Error>','invalid args. \n' + cmdFormat);
  process.exit(1);
}

deasync = require('deasync');
function sleep(ms) {
  var done = false;
  setTimeout( function() {
    done = true;
  }, ms);
  while (!done) {
    deasync.sleep(100);
  }
}

function parseArgs() {
  argv = process.env.npm_package_scripts_test.split(' ');
  var snapname;
  var loadname;
  var buildContracts;
  var noDeploy;

  if (argv.length > 3) {
    argv = argv.slice(3);
    for (i=0; i<argv.length;) {
      if (argv[i] == '":snap"' || argv[i] == '":s"') {
        if (i+1 == argv.length) invalidArgsExit();
        snapname = argv[i+1].substring(1, argv[i+1].length-1);;
        i += 2;
      }
      else if (argv[i] == '":load"' || argv[i] == '":l"') {
        if (i+1 == argv.length) invalidArgsExit();
        loadname = argv[i+1].substring(1, argv[i+1].length-1);
        i += 2;
      }
      else if (argv[i] == '":build-contracts"' || argv[i] == '":bc"') {
        buildContracts = true;
        i++;
      }
      else if (argv[i] == '":no-deploy"' || argv[i] == '":nd"') {
        noDeploy = true;
        i++;
      }
      else if (argv[i] == '":help"' || argv[i] == '":h"') {
        console.log(cmdFormat);
        process.exit(0);
      }
      else {
        invalidArgsExit();
      }
    }
  }

  return {
    snapname: snapname,
    loadname: loadname,
    bc: buildContracts,
    nd: noDeploy,
  }
}

// ----------------------------------------------------
// run procedure
// ----------------------------------------------------
args = parseArgs();
chain = require('./chain');
printDiv('start booting chain ...', false);

// boot from snapped data if any
chain.boot(args.loadname);

// create contract accounts if fresh new chain booted
// then snap the chain if snapname provided
if (!args.loadname) {
  // create contract accounts
  printDiv('creating custome contract owner accounts (their keys already imported into wallet) ...');
  chain.createCustomContractAccounts();

  // try snapshot chain data, do nothing if args.snapname not defined
  chain.snapshotChainData(args.snapname);
}

// build contract if required
if (args.bc) {
  printDiv('building contracts ...');
  chain.buildCustomContracts();
}

// deploy custom contracts if no-deploy missed
if (!args.nd) {
  printDiv('deploying contracts ...');
  chain.deployCustomContracts();
}

// setup eosjs -> run test
EOS = require('./eosjs');
test = require('./testcases');
var flags = {finished: false};
printDiv('setting up eosjs ...');
let eos = new EOS();
eos.setup( (liveEos) => {
  // create and run all the test
  testcases = test.createTestCases(liveEos);
  test.runTestCases(testcases, flags);
});

// sync
sleep(1000);
