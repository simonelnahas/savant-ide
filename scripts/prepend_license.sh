#!/bin/bash

set -e

BANNER='/**
  * Copyright (c) 2018 Zilliqa 
  * This source code is being disclosed to you solely for the purpose of your participation in 
  * testing Zilliqa. You may view, compile and run the code for that purpose and pursuant to 
  * the protocols and algorithms that are programmed into, and intended by, the code. You may 
  * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd., 
  * including modifying or publishing the code (or any part of it), and developing or forming 
  * another public or private blockchain network. This source code is provided ‘as is’ and no 
  * warranties are given as to title or non-infringement, merchantability or fitness for purpose 
  * and, to the extent permitted by law, all liability for your use of the code is disclaimed. 
  * Some programs in this code are governed by the GNU General Public License v3.0 (available at 
  * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by 
  * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends 
  * and which include a reference to GPLv3 in their program files.
  **/\n'

files=($(find -name *.tsx -name *.ts ./src/* -type f))

quoteSubst() {
  IFS= read -d '' -r < <(sed -e ':a' -e '$!{N;ba' -e '}' -e 's/[&/\]/\\&/g; s/\n/\\&/g' <<<"$1")
  printf %s "${REPLY%$'\n'}"
}

hasBanner() {
  if grep -Fxq "$BANNER" "$1"
  then
    return 1
  else
    return 0
  fi
}

addBanner() {
  sed -i "1s/^/$(quoteSubst "$BANNER")/g" "$1"
}

# hasBanner test.txt

for file in "${files[@]}"
do
  if hasBanner "$file"
  then
    echo "Proceeding to add banner"
    addBanner "$file"
  else
    echo "Found banner, will not add"
  fi
done
