
[![Build Status](https://travis-ci.com/Zilliqa/savant-ide.svg?token=JW9XZmrp42GWiwtgCs9i&branch=master)](https://travis-ci.com/Zilliqa/savant-ide)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/Zilliqa/savant-ide/blob/master/LICENSE)
[![Gitter chat](http://img.shields.io/badge/chat-on%20gitter-077a8f.svg)](https://gitter.im/Zilliqa/SmartContract)

### Savant IDE

A souped-up IDE for testing Scilla smart contracts painlessly. It can be tried out at https://savant-ide.zilliqa.com/ (works best on Chrome). 

Scilla is a smart contract language being developed for Zilliqa. To learn more about the language, visit https://scilla-lang.org/.

## Motivation

The [previous iteration](https://ide.zilliqa.com) of Scilla IDE was useful for
context-free testing of arbitrary Scilla smart contracts. However, its user
experience was not ideal for testing of complex contracts due to the need to
manually copy-and-paste state transitions and/or to manually adjust parameters
to simulate real blockchain behavior.

It was a time sink for developers coming looking for a quick and
easy way to try Scilla out. Savant attempts to address this shortcoming by
enabling an automated development environment, in-browser, with quick and
intuitive controls.

## Features

Savant best works with Chrome browser and supports the following features:

- Fast, in-browser pseudo-blockchain with persistent state, including previous
  calls/events/messages.
- Intuitive UI for easy deployment/contract invocation.
- Automatic block height counter for contracts that depend on block height.
- Simple, persistent file manager for managing your contracts that allows for
  renaming/deletion.
- Support for `event` in contracts, with automatic notifications in the UI.
- Support for arbitrary gas price/gas limit in deployment/calls.
- Toggle between raw Scilla output and native JS representation when viewing
  state.

## Building and running locally

Savant is easy to build and run locally. Because Savant relies on IndexedDB,
it is possible to use it offline, without suffering a loss of data as long as
you serve the app from the same address (default: `localhost:3000`), and the
cache is not cleared.

To build and run Savant:

```
git clone https://github.com/Zilliqa/savant-ide && cd savant-ide

# install all dependencies, including system dependencies
# to use specific branch of scilla, append SCILLA_BRANCH=my_specific_branch:
# make SCILLA_BRANCH=some_other_branch
make

# start IDE app dev server
yarn run start
```

Note: the makefile only supports Ubuntu and MacOS.

## Roadmap

- [ ] Additional unit tests.
- [ ] Account-to-account transfers of ZIL.
- [ ] Multi-contract calls.
- [ ] 'REPL' mode that behaves like the IDE, for full control over parameters.
- [ ] Adjustable block height increment speed.

## Contributing

Contributions/critiques are most welcome. If you wish to contribute,
please submit a PR.
