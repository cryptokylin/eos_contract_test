#!/bin/bash
dir=`pwd`
/usr/local/eosio/bin/cleos -u http://127.0.0.1:8888 wallet unlock -n localtest --password $(cat ${dir}/eosio-wallet/localtestpass)