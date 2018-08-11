#!/bin/bash
dir=`pwd`
/usr/local/eosio/bin/nodeos --config-dir ${dir}/config --data-dir ${dir}/data &>/dev/null &