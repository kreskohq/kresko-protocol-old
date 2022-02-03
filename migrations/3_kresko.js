const Kresko = artifacts.require('Kresko');
const ERC20Harness = artifacts.require('ERC20Harness')

module.exports = async function (deployer) {
  // Celo token address to constructor
	await deployer.deploy(Kresko,
    ERC20Harness.address, // '0x874069fa1eb16d44d622f2e0ca25eea172369bc1', // cUSD on alfajores
    {
      gas: '5000000'
    }
  );
	await Kresko.deployed()
};
