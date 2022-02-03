const AMM = artifacts.require('AMM')
const BasicOracle = artifacts.require('BasicOracle')
const KAsset = artifacts.require('KAsset')
const Kresko = artifacts.require('Kresko')
const Reserve = artifacts.require('Reserve')
const UniswapMath = artifacts.require('UniswapMath')
const { toWei } = require('web3-utils')

module.exports = async function (deployer, { ticker, name, from, cUsdAddress }) {
	console.log(`Deploying ${name} (${ticker})`)

	const kresko = await Kresko.deployed()

	/// BasicOracle
	const oracle = await BasicOracle.new(
		from,
		{ from } // mark self as reporter
	)
	console.log('Oracle deployment finished')

	/// kAsset
	const kAsset = await KAsset.new(kresko.address, name, ticker)
	console.log('kAsset deployment finished')

	/// AMM
	await deployer.link(UniswapMath, AMM)
	const amm = await AMM.new(
		kresko.address,
		oracle.address,
		cUsdAddress, // cUSD on alfajores
		kAsset.address,
		'60' // 60 seconds
	)
	console.log('AMM deployment finished')

	/// Reserve
	const reserve = await Reserve.new(
		cUsdAddress, // cUSD on alfajores
		kresko.address,
		amm.address
	)
	await amm.setReserve(reserve.address)
	console.log('Reserve deployment finished')

	/// list
	await kresko.listKAsset(
		kAsset.address,
		amm.address,
		reserve.address,
		oracle.address,
		toWei('1.5', 'ether').toString()
	)
	console.log('kAsset listed')

	console.log('Addresses')
	console.group({
		oracle: oracle.address,
		amm: amm.address,
		reserve: reserve.address,
		kAsset: kAsset.address
	})
}
