config = {
  // --- the eosio native token name
  CORE_SYMBOL_NAME: 'SYS',

  // --- daemon url
  NODEOS_URL: 'http://127.0.0.1:8888',
  WALLET_URL: 'http://127.0.0.1:8900',

  // --- eosio bin folder (after make install)
  EOSIO_BIN: '/usr/local/eosio/bin/',

  // --- wallet
  WALLET_NAME: 'localtest',
  WALLET_PASS: 'PW5J7qvXT2CWxGHZ6dDxJxRe5DqXgJ7PcWHZgQp9u5GmQWn3RkWYs',

  // --- eosio.* account key, this key already imported into the localtest wallet
  //     the private key list here incase of use by eosjs api
  EOSIO_ACCOUNT_PUB_KEY: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV', // from config.ini
  EOSIO_ACCOUNT_PRI_KEY: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',   // from config.ini

  // --- eosio.system account key, already imported into the localtest wallet
  SYS_ACCOUNT_PUB_KEY: 'EOS5bdaqc13gAY3JP5nNq74zFtoaF7DPvS9mEMPHDYdoyWqa3x6rt',

  // --- define the contract folder from the build of the eosio source code
  SYS_CONTRACTS_FOLDER: '/home/shenghua/projects/source/eos/build/contracts/',

  // --- define test accounts for convenience
  //     keys not imported into localtest wallet
  TEST_ACCOUNTS: [
    {
      name: 'test1',
      pub: 'EOS7sJUCRJH7dBb6BC6cdJsV5AvoYQnoe9PoFDaYMsdHzzFZiFhz1',
      pri: '5Jatsa64EthBhoneYPVLM6BCK758Pvu16Yxwcc2tGddnyo7Uctg'
    },
    {
      name: 'test2',
      pub: 'EOS68VSnRVA6T1GHm5eh7qxg4PbVnrEwZX6gu2NygMst497t4Cap8',
      pri: '5JGFWwmYhbtSq3dyPPjZvvQiNxi7zYKRuwJftat6rS2jQ1n7ftA'
    },
    {
      name: 'test3',
      pub: 'EOS6qZF3kB2pQARdmgjHAxcuQuNq6EHZuXERrhZvFyqKzFowrkYvP',
      pri: '5Je5vz2stKT3HhmfzSw3ymiZ6ZhbDx9sHJE9C5BTQRPo7o6TqtS'
    },
    {
      name: 'test4',
      pub: 'EOS6zVuoxBTN7rzXmLNejkUMa5qctvUpkGaSTPn4eGzMgtmeuCNby',
      pri: '5KVvahMoPv5smycJExxfnBwYYjGeQzv1WtEF52MGCZgPGkpWz9X'
    },
    {
      name: 'test5',
      pub: 'EOS5LAwbJ4s6akXmncxusYL92PcfKxSwawk74quqJ3gGgYqTa7zFQ',
      pri: '5K6Wye2XnqUh4FkJT3iqfBA6xvYSL8UnbLsSnhCRP9uJgpdLx82'
    }
  ],

  // --- define contract account for convenience
  //     keys already imported into localtest wallet
  CONTRACT_ACCOUNTS : [
    {
      name: 'contract1111',
      pub: 'EOS5vWV2DcHvmREyHg86wHjULgqC3NE5CPyY15795xsYpchEvJnu4',
      pri: '5JjvAVZZEscqgRR2noZAv2y5h5rJ6mts8rm4cZZdDnw4JRkptsY'
    },
    {
      name: 'contract2222',
      pub: 'EOS5vWV2DcHvmREyHg86wHjULgqC3NE5CPyY15795xsYpchEvJnu4',
      pri: '5JjvAVZZEscqgRR2noZAv2y5h5rJ6mts8rm4cZZdDnw4JRkptsY'
    }
  ],

  // --- custom contracts
  CUSTOM_CONTRACTS : [
    {
      account: 'contract1111',
      name:   'btc.token',
      folder: __dirname + '/exampleContracts/',
    },
  ]
}

module.exports = config;
