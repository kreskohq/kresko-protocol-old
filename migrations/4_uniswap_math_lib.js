const UniswapMath = artifacts.require('UniswapMath')

module.exports = async function (deployer, _network, accounts) {
	// UniswapMath library
	await deployer.deploy(
		UniswapMath,
		{
      gas: '5000000'
    }
	)
	await UniswapMath.deployed()
	console.log('UniswapMath address', UniswapMath.address)
};
