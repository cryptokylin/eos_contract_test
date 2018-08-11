#!/bin/bash
dir=`pwd`
/usr/local/eosio/bin/keosd --http-server-address=127.0.0.1:8900 -d ${dir}/eosio-wallet &>/dev/null &

