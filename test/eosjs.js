
eos = require('eosjs');
// ecc = require('eosjs-ecc');
config = require('./config');

// fs = require('fs');
// printDiv('deploying contract "' + contract.config.NAME + '" ...');
// path = contract.config.FOLDER + contract.config.NAME + '/';
// wasm = fs.readFileSync(path + contract.config.NAME + '.wasm');
// abi = fs.readFileSync(path + contract.config.NAME + '.abi');
// eos.setcode('eosio', 0, 0, wasm);
// eos.setcode('eosio', JSON.parse(abi));
// sleep(1000);

module.exports = class Eos {

  static keys() {
    console.log('--- saving private keys for eosjs config ...')
    let ks = [];
    console.log('saving key for account:', 'eosio');
    ks.push(config.EOSIO_ACCOUNT_PRI_KEY);
    config.CONTRACT_ACCOUNTS.forEach( (account) => {
      console.log('saving key for account:', account.name);
      ks.push(account.pri);
    });
    return ks;
  }

  static defaultConfig() {
    return {
      chainId: '',                      // 32 byte (64 char) hex string
      keyProvider: Eos.keys(),         // WIF string or array of keys ..
      httpEndpoint: config.NODEOS_URL,
      expireInSeconds: 60,
      broadcast: true,
      verbose: false,                   // API activity
      sign: true,
      logger: {
        log: null,   // set console.log to show
        error: null, // set console.error to show
      }
    }
  }

  makeAction(account, action, dat) {
    return {
      account: account,
      name: action,
      authorization: [{
        actor: account,
        permission: 'active'
      }],
      data: dat
    };
  }

  constructor(config) {
    this.config = config ? config : Eos.defaultConfig();
    this.api = eos(this.config);
  }

  setup(callback) {
    this.api.getInfo( (err, ret) => {
      if (!err) {
        this.config.chainId = ret.chain_id;
        // console.log(this);
        this.api = eos(this.config);
        console.log('eosjs ready.');
        if (callback) callback(this);
      }
    });
  }

  createAccounts(creator, accounts, rambytes=8192, netTokenAmount=10, cpuTokenAmount=10) {
    accounts.forEach( (account) => {
      console.log('creating account:', account.name);
      this.api.transaction(tr => {
        tr.newaccount({
          creator: creator,
          name: account.name,
          owner: account.pub,
          active: account.pub
        })

        tr.buyrambytes({
          payer: creator,
          receiver: account.name,
          bytes: rambytes
        })

        tr.delegatebw({
          from: creator,
          receiver: account.name,
          stake_net_quantity: netTokenAmount.toFixed(4) + ' ' + config.CORE_SYMBOL_NAME,
          stake_cpu_quantity: cpuTokenAmount.toFixed(4) + ' ' + config.CORE_SYMBOL_NAME,
          transfer: 0
        })
      });
    });
  }
}
