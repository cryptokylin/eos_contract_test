
var shell = require('shelljs');
var sleep = require('sleep');
const config = require('./config');

// ----------------------------------------------------
// constants
CLEOS = config.EOSIO_BIN + 'cleos --wallet-url ' + config.WALLET_URL + ' -u ' + config.NODEOS_URL;
EOSIOCPP = config.EOSIO_BIN + 'eosiocpp';
EOSIO2WASM = config.EOSIO_BIN + 'eosio-wast2wasm';

CORE_SYMBOL_NAME = config.CORE_SYMBOL_NAME;

// ----------------------------------------------------
// functions implemented by shell scripts
unlockWallet = function() {
  console.log('unlocking wallet ...');
  cmdline = CLEOS + ' wallet unlock -n ' + config.WALLET_NAME + ' --password ' + config.WALLET_PASS;
  shell.exec(cmdline, {silent: true});
}

startNodeos = function() {
  console.log('starting nodeos ...');
  cmdline = '/usr/local/eosio/bin/nodeos --config-dir ' + __dirname + '/eosio/config' + ' --data-dir ' + __dirname + '/eosio/data &';
  shell.exec(cmdline, {silent: true, async: true});
  sleep.sleep(1);
}

stopNodeos = function() {
  console.log('stopping nodeos ...');
  shell.exec('pkill nodeos');
}

startKeosd = function() {
  console.log('starting keosd ...')
  dataDir = __dirname + '/eosio/eosio-wallet';
  cmdline = '/usr/local/eosio/bin/keosd --http-server-address=' + config.WALLET_URL.substr(7) + ' -d ' + dataDir + ' &';
  shell.exec(cmdline,  {silent: true, async: true});
}

cleanChainData = function() {
  console.log('cleaning previous chain data ...')
  shell.exec('rm -rf ' + __dirname + '/eosio/data');
}

pushAction = function(code, action, arg, account) {
  cmdline = CLEOS + ' push action ' + code + ' ' + action + ' \'' + arg  + '\' -p ' + account;
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

function createAccount(creator, new_account, key) {
  cmdline = CLEOS + ' create account ' + creator + ' ' + new_account + ' ' + key;
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

buyram = function(payer, receiver, token_amount) {
  cmdline = CLEOS + ' system buyram ' + payer + ' ' + receiver + ' "' + token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '"';
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

delegatebw = function(payer, receiver, net_token_amount, cpu_token_amount) {
  net_arg = ' "' + net_token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '"';
  cpu_arg = ' "' + cpu_token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '"';
  cmdline = CLEOS + ' system delegatebw ' + payer + ' ' + receiver + net_arg + cpu_arg;
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

newAccount = function(creator, account_name, key, net_token_amount=10, cpu_token_amount=10, ram_token_amount=10) {
  net_arg = ' "' + net_token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '" ';
  cpu_arg = ' "' + cpu_token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '" ';
  ram_arg = ' "' + ram_token_amount.toFixed(4) + ' ' + CORE_SYMBOL_NAME + '" ';
  cmdline = CLEOS + ' system newaccount --stake-net ' + net_arg +
                                      ' --stake-cpu ' + cpu_arg +
                                      ' --buy-ram '   + ram_arg +
                                      creator + ' ' + account_name + ' ' + key;
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

createAccounts = function(accounts) {
  accounts.forEach( (account) => {
    console.log('creating account:', account.name);
    newAccount('eosio', account.name, account.pub, 10, 10, 10);
  });
}

createTestAccounts = function() {
  createAccounts(config.TEST_ACCOUNTS);
}

createCustomContractAccounts = function() {
  createAccounts(config.CONTRACT_ACCOUNTS);
}

setContract = function(account, contract, folder = config.SYS_CONTRACTS_FOLDER) {
  cmdline = CLEOS + ' set contract ' + account + ' ' + folder + contract + ' -p ' + account;
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

deployContract = function(account, contractFullpath) {
  setContract(account, contractFullpath, '');
}

deployCustomContracts = function() {
  config.CUSTOM_CONTRACTS.forEach( (contract) => {
    console.log('deploying contract:', contract.name);
    setContract(contract.account, contract.name, contract.folder)
  });
}

buildContract = function(contract, folder) {
  shell.cd(folder + contract);
  console.log('building ' + contract + '.wast ...');
  cmdline = EOSIOCPP + ' -o ' + contract + '.wast ' + contract + '.cpp';
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }

  console.log('building ' + contract + '.abi ...');
  cmdline = EOSIOCPP + ' -g ' + contract + '.abi ' + contract + '.cpp';
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }

  console.log('generating ' + contract + '.wasm ...');
  cmdline = EOSIO2WASM + ' ' + contract + '.wast ' + contract + '.wasm';
  ret = shell.exec(cmdline,  {silent: true});
  if (ret.code != 0) {
    console.log('\033[31m<Error>\033[0m', ret.stderr);
  }
}

buildCustomContracts = function() {
  config.CUSTOM_CONTRACTS.forEach( (contract) => {
    console.log('building contract:', contract.name);
    buildContract(contract.name, contract.folder);
  });
}

snapshotExists = function(snapname) {
  return shell.test('-d', __dirname + '/eosio/snapshot/' + snapname);
}

snapshotChainData = function(snapname, callback) {
  if (!snapname) return;
  stopNodeos();
  path = __dirname + '/eosio/snapshot/';
  if (!shell.test('-d', path)) {
    shell.mkdir('-p', path);
  }
  if (shell.test('-d', path + snapname)) {
    console.log('overwriting snapshot "' + snapname + '" ...');
    shell.rm('-rf', path + snapname);
  }
  else {
    console.log('saving snapshot "' + snapname + '" ...');
  }
  shell.exec('cp -r ' + __dirname + '/eosio/data ' + path + snapname);
  startNodeos();
}

loadChainData = function(snapname) {
  if (shell.test('-d', __dirname + '/eosio/snapshot/' + snapname)) {
    console.log('loading snapshot "' + snapname + '" ...');
    shell.rm('-rf', __dirname + '/eosio/data');
    shell.exec('cp -r ' + __dirname + '/eosio/snapshot/' + snapname + ' ' + __dirname + '/eosio/data');
  }
}

function setupChain() {
  // set contract eosio.bios
  console.log('deploying eosio.bios contract ...')
  setContract('eosio', 'eosio.bios');

  // create system accounts
  system_accounts = ['eosio.bpay', 'eosio.msig', 'eosio.names', 'eosio.ram', 'eosio.ramfee', 'eosio.saving', 'eosio.stake', 'eosio.token', 'eosio.vpay'];
  console.log('creating system accounts: ', system_accounts);
  system_accounts.forEach( (account_name) => {
    createAccount('eosio', account_name, config.SYS_ACCOUNT_PUB_KEY);
  });

  // set contract
  console.log('deploying eosio.token contract ...');
  setContract('eosio.token', 'eosio.token');
  console.log('deploying eosio.msig contract ...');
  setContract('eosio.msig', 'eosio.msig');

  // create and issue token
  console.log('creating token: ', CORE_SYMBOL_NAME);
  pushAction('eosio.token', 'create', '["eosio", "10000000000.0000 ' + CORE_SYMBOL_NAME + '"]', 'eosio.token');
  console.log('issuing token: ', CORE_SYMBOL_NAME);
  pushAction('eosio.token', 'issue', '["eosio",  "1000000000.0000 ' + CORE_SYMBOL_NAME + '", "local testnet"]', 'eosio');

  // setting privileged account for eosio.msig
  console.log('setting eosio.msig privilege ...');
  pushAction('eosio', 'setpriv', '{"account": "eosio.msig", "is_priv": 1}', 'eosio');

  // set contract eosio.system, will fail if create token symbol name not same as CORE_SYMBOL_NAME
  console.log('deploying eosio.system contract ...');
  setContract('eosio', 'eosio.system');

  // buy ram, delegate bandwidth and cpu
  console.log('buying ram for eosio ...');
  buyram('eosio', 'eosio', 10000);
  console.log('delegating net and cpu for eosio ...');
  delegatebw('eosio', 'eosio', 10000, 10000);
}

// --- boot from existing snapshot chain data
//     otherwise boot with fresh new chain
boot = function(snapname) {
  if (!snapname || !snapshotExists(snapname)) {
    cleanChainData();
    startKeosd();
    unlockWallet();
    startNodeos();
    setupChain();
  }
  else {
    loadChainData(snapname);
    startKeosd();
    unlockWallet();
    startNodeos();
  }
}

// --- exports
module.exports.boot = boot;

module.exports.pushAction = pushAction;

module.exports.newAccount = newAccount;
module.exports.createCustomContractAccounts = createCustomContractAccounts;

module.exports.buildContract = buildContract;
module.exports.buildCustomContracts = buildCustomContracts;

module.exports.deployContract = deployContract;
module.exports.deployCustomContracts = deployCustomContracts;

module.exports.snapshotChainData = snapshotChainData;
module.exports.loadChainData = loadChainData;
