import { abi as KreskoAbi } from '../build/contracts/Kresko.json'
import { abi as AmmAbi } from '../build/contracts/AMM.json'
import { e18 } from '../test/maths'
import { addresses, kit } from './common'
import { StableToken } from '@celo/contractkit'

async function main() {
	const cUSD = await kit.contracts.getStableToken(StableToken.cUSD)
	const amm = new kit.web3.eth.Contract(AmmAbi as any, addresses.AMM)

	const amount = e18(0.5).toString()
	await cUSD.approve(addresses.AMM, amount).send({ from: kit.defaultAccount })

	console.log('Buying...')
	await amm.methods.swap(amount, cUSD.address).send({ from: kit.defaultAccount })
	console.log('Bought!')
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
