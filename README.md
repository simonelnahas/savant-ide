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

- Test crowdfunding for 1) Withdrawal before deadline [fail] 2) Deadline not reached,
  owner recovers [fail] 3) User wants to get refund _after_ deadline
  [success]. Use 2 users - both should contribute different amounts.
- Add social links as a Footer component.
- Catch errors thrown by malformed syntax/types.
- Add link to scilla docs.
- Rename not updating database.
- Display blocknumber in UI.
- Move `Select Account` to the right-hand panel.
- File name length checks.
- Validate inputs for deployment
- Hook up `/contract/run` response to UI
- Add `/contract/check` errors to the editor UI as markers
- Add snackbar component to notify user that contract is checked
- Add makefile
