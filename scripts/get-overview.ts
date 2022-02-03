import { newKit, StableToken } from '@celo/contractkit'
import { abi as AmmAbi } from '../build/contracts/AMM.json'
import { abi as ERC20Abi } from '../build/contracts/ERC20.json'
import { abi as KreskoAbi } from '../build/contracts/Kresko.json'
import { e18 } from '../test/maths'

import Web3 from 'web3'

import { kit, addresses } from './common'

const {
	utils: { fromWei }
} = Web3

async function main() {
	const cUSD = await kit.contracts.getStableToken(StableToken.cUSD)

	const kresko = new kit.web3.eth.Contract(KreskoAbi as any, addresses.Kresko)
	const kAsset = new kit.web3.eth.Contract(ERC20Abi as any, addresses.KTSLA)

	console.log('User')
	console.group({
		cUSD: fromWei((await cUSD.balanceOf(kit.defaultAccount!)).toFixed()),
		kTSLA: fromWei(await kAsset.methods.balanceOf(kit.defaultAccount!).call())
	})

	console.log('Collateral')
	console.group({
		cUSD: fromWei(
			await kresko.methods.getCollateralAmountOwned(addresses.KTSLA, kit.defaultAccount).call()
		),
		kTSLA: fromWei(
			await kresko.methods.getKAssetAmountOwned(addresses.KTSLA, kit.defaultAccount).call()
		)
	})

	console.log('Reserve')
	console.group({
		cUSD: fromWei((await cUSD.balanceOf(addresses.Reserve)).toFixed())
	})

	console.log('AMM Buckets')
	console.group({
		cUSD: fromWei((await cUSD.balanceOf(addresses.AMM)).toFixed()),
		kTSLA: fromWei(await kAsset.methods.balanceOf(addresses.AMM).call())
	})
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
