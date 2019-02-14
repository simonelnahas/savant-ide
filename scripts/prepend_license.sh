#!/bin/bash

set -e

BANNER='/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */'

files=($(find ./src/* -regex ".*\.\(ts\|tsx\)" -type f))

quoteSubst() {
  IFS= read -d '' -r < <(sed -e ':a' -e '$!{N;ba' -e '}' -e 's/[&/\]/\\&/g; s/\n/\\&/g' <<<"$1")
  printf %s "${REPLY%$'\n'}"
}

hasBanner() {
  if grep -Fxq ' * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.' "$1"
  then
    echo 0
  else
    echo 1
  fi
}

addBanner() {
  sed -i "1s/^/$(quoteSubst "$BANNER")\n\n/g" "$1"
}

for file in "${files[@]}"
do
  res=$(hasBanner "$file")
  if [ $res -eq 0 ]
  then
    echo "$file has banner, skipping."
  else
    echo "Adding banner to $file."
    addBanner "$file"
  fi
done
