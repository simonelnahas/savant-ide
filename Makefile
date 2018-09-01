# This really just adds some conveniences.
# Mostly, this is so you don't have to care about creating directories or
# building the Scilla binaries by hand.
.PHONY: default all clean bootstrap scilla-bin docker

default: all

all: clean bootstrap scilla-bin

bootstrap:
	mkdir temp
	yarn install

clean:
	rm -rf temp
	rm -rf scilla
	rm -rf node_modules

scilla-bin:
	git clone git@github.com:Zilliqa/scilla
	$(MAKE) -C scilla opamdep
	$(MAKE) -C scilla all
