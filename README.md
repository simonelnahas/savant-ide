### [WIP] Scilla IDE v2.0

A souped-up, Remix-like IDE for testing Scilla smart contracts easily.

## Installation

```
git clone https://github.com/Zilliqa/Scilla-IDE && cd Scilla-IDE

# Bootstrap the IDE app
yarn install
mkdir temp

# clone scilla repo and build the binaries
# follow instructions on https://github.com/Zilliqa/scilla/INSTALLATION.md
git clone https://github.com/Zilliqa/scilla

# start IDE app dev server
yarn run start
```

## TODO

- Validate inputs for deployment
- Hook up `/contract/run` response to UI
- Add `/contract/check` errors to the editor UI as markers
- Add snackbar component to notify user that contract is checked
