#!/bin/bash

set -e

echo "Installing system dependencies required for building Scilla binaries..."

apt-get -qq update

apt-get install -y \
  curl \
  build-essential \
  m4 \
  ocaml \
  opam \
  pkg-config \
  zlib1g-dev \
  libgmp-dev \
  libffi-dev \
  libssl-dev \
  libboost-system-dev

