import { abi as AmmAbi } from '../build/contracts/AMM.json'
import { abi as KAssetAbi } from '../build/contracts/KAsset.json'
import { e18 } from '../test/maths'
import { addresses, kit } from './common'

async function main() {
	const amm = new kit.web3.eth.Contract(AmmAbi as any, addresses.AMM)
	const kAsset = new kit.web3.eth.Contract(KAssetAbi as any, addresses.KTSLA)

	const amount = e18(5).toString()
	await kAsset.methods.approve(addresses.AMM, amount).send({ from: kit.defaultAccount })

	console.log('Selling...')
	await amm.methods.swap(amount, addresses.KTSLA).send({ from: kit.defaultAccount })
	console.log('Sold!')
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
