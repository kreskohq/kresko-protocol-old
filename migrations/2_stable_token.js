const ERC20Harness = artifacts.require('ERC20Harness')

// This is our fake "StableToken" we use for testnets
module.exports = async function (deployer, _network, accounts) {
	await deployer.deploy(
		ERC20Harness,
    'Fake StableToken',
		'fcUSD',
    {
      gas: '5000000'
    }
  );
	const stableToken = await ERC20Harness.deployed()
	// Set to 100m (w/ 18 decimals)
	await stableToken.setBalance(accounts[0], '100000000000000000000000000', {from: accounts[0]})

	console.log('Fake StableToken address', stableToken.address)
};
