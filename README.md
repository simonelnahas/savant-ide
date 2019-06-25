
[![Build Status](https://travis-ci.com/Zilliqa/savant-ide.svg?token=JW9XZmrp42GWiwtgCs9i&branch=master)](https://travis-ci.com/Zilliqa/savant-ide)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/Zilliqa/savant-ide/blob/master/LICENSE)
[![Gitter chat](http://img.shields.io/badge/chat-on%20gitter-077a8f.svg)](https://gitter.im/Zilliqa/SmartContract)

### Savant IDE

A souped-up IDE for testing Scilla smart contracts painlessly. It can be tried out at https://savant-ide.zilliqa.com/ (works best on Chrome). 

Scilla is a smart contract language being developed for Zilliqa. To learn more about the language, visit https://scilla-lang.org/.

## Motivation

The previous iteration of Scilla IDE was useful for
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

# Architecture

![](https://raw.githubusercontent.com/zilliqa/savant-ide/blob/dev/savant.svg)

In order to ease deployment, the project is deployed to AWS using
a combination of the following technologies:

- ECS/ECR
- Fargate
- CodeDeploy
- S3
- CloudFront

The AWS network topology is simple and consists of the following:

- 2x private subnets with NAT
- 2x public subnets with internet gateway
- 1x ALB (internet-facing)

A single ALB is provisioned over the two public subnets, making it
reachable via DNS. It listens only for TCP connections on 443. At any point in
time, the ALB routes incoming requests to one of two target groups:

1. `savant-ide-api-tg-blue`
2. `savant-ide-api-tg-green`

This facilitates so-called blue/green (a.k.a canary) deployments via
CodeDeploy. Please note that Fargate cluster **must** be in private subnets,
while the ALB must be in a public subnet(s). This is because the ALB is unable
to find publicly routable ECS tasks in public subnets!

## Frontend

The frontend is built with the usual Webpack workflow which can be easily
inspected from the webpack config. Once compiled, all static assets are simply
synced to a public s3 bucket that sits behind a CloudFront distribution.

## Backend

On each successful Travis build, a new image of the backend API is pushed to
ECR. This new image is then deployed to ECS via a pre-configured CodeDeploy
application.

ECS tasks are deployed powered by a Fargate. The new task is registered on the
empty target group, which then receives ALB traffic.  After 5 minutes, if
health checks pass (by performing a GET request on port 9615), the old task is
removed. Otherwise, a rollback occurs.

## Roadmap

- [ ] Additional unit tests.
- [ ] Account-to-account transfers of ZIL.
- [ ] Multi-contract calls.
- [ ] 'REPL' mode that behaves like the IDE, for full control over parameters.
- [x] Adjustable block height increment speed.

## Contributing

Contributions/critiques are most welcome. If you wish to contribute,
please submit a PR.
