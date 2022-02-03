# Kresko Protocol
Kresko’s mission is to help people in developing countries grow wealth by bringing them access to global markets.

Kresko protocol allows creation of crypto backed synthetic assets in a capital efficient way.

**NOTE:** This is Kresko’s old codebase. We are developing Kresko v1 privately and we will make it public before its release.


## Setup

This requires Node v12 or higher.

```
# to check your current node version:
node -v

# if the version is < 12, use nvm to use v12
nvm use 12
```

Install dependencies:

```
yarn
```

## Deploying to Alfajores

Deployments with hardhat to alfajores are fairly painful, so in the short term we
use truffle for test deployments to Alfajores. The hardhat-celo plugin is
very ubeswap-specific, so we will need to do some work to make it a little more
agnostic.

Set up the node with our key (note these are bad practices and should only be for alfajores):

```
# start at home
cd

# make a dir for the alfajores datadir
mkdir alfajores-datadir && cd alfajores-datadir

export CELO_IMAGE=us.gcr.io/celo-org/geth:mainnet

# this is a dummy account with some alfajores funds
# just don't try to use it for mainnet lol
export ADDRESS=0xREDACTED
export PRIVATE_KEY=REDACTED

# start the lightest node
docker run --name celo-node -d --restart unless-stopped --stop-timeout 300 -p 127.0.0.1:8545:8545 -p 127.0.0.1:8546:8546 -p 30303:30303 -p 30303:30303/udp -v $PWD:/root/.celo $CELO_IMAGE --verbosity 3 --syncmode lightest --rpc --rpcaddr 0.0.0.0 --rpcapi eth,net,web3,debug,admin,personal --light.serve 90 --light.maxpeers 1000 --maxpeers 1100 --etherbase $ADDRESS --datadir /root/.celo --nousb --alfajores --allow-insecure-unlock

# attach
docker exec -it celo-node geth attach

# now in the repl:
> personal.importRawKey('REDACTED', 'SOME_PASSWORD')
# should print the lowecase value of $ADDRESS

> personal.unlockAccount('0xREDACTED', 'SOME_PASSWORD', 0)
# should give "true"

# now lets confirm our account is unlocked:
> personal.listWallets
# should show its status as "Unlocked"
```

Now we can migrate that bad boy:

```
# in kresko-protocol:
yarn truffle migrate --network alfajores
```

We can then mess around with the truffle console:

```
yarn truffle console --network alfajores

truffle(alfajores)> kAsset = await KAsset.deployed()
undefined
truffle(alfajores)> kAsset.symbol()
'kTSLA'
```
