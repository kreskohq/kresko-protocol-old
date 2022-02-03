const deployAndList = require('./utils/deploy_and_list')
const ERC20Harness = artifacts.require('ERC20Harness')

module.exports = async function (deployer, _network, accounts) {
	await deployAndList(deployer, {
		ticker: 'kETH',
		name: 'Kresko Ether',
		cUsdAddress: ERC20Harness.address,
		from: accounts[0]
	})
}
