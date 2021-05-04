import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber, Signer } from 'ethers'
import { deployERC20Harness, deployKAssetAndFriends, deployKresko } from './utils'
import { Kresko } from '../typechain/Kresko'
import { AMM } from '../typechain/AMM'
import { KAsset } from '../typechain/KAsset'

import { expand, sqrt } from './maths'
import { ERC20Harness } from '../typechain/ERC20Harness'

async function w(x: Promise<any>) {
	await (await x).wait()
}

describe('AMM', () => {
	let kresko: Kresko
	let stableToken: ERC20Harness

	let amm: AMM
	let kAsset: KAsset

	let owner: any
	let user0: any
	let user1: any

	// beforeEach(async () => {
	// 	stableToken = await deployERC20Harness()
	// 	kresko = await deployKresko(stableToken)
	// 	;({ amm, kAsset } = await deployKAssetAndFriends(
	// 		stableToken,
	// 		kresko,
	// 		'Kresko TSLA',
	// 		'kTSLA'
	// 	))
	// 	;[owner, user0, user1] = await ethers.getSigners()

	// 	// await w(kresko.depositCollateral(kAsset.address, expand(1000)))
	// 	await w(stableToken.mint(owner.address, expand(100_000)))
	// 	await w(stableToken.mint(user0.address, expand(100_000)))

	// 	await addLiquidity(100, 10)

	// 	const expectedLiquidity = sqrt(BigNumber.from(expand(100).mul(expand(10))))
	// 	expect(await amm.balanceOf(owner.address)).to.equal(expectedLiquidity)
	// })

	async function addLiquidity(amount0: number, amount1: number) {
		await w(stableToken.transfer(amm.address, expand(amount0)))
		await w(kAsset.transfer(amm.address, expand(amount1)))
		await w(amm.mint())
	}

	// it.skip('swaps', async () => {
	// 	const balance0 = await stableToken.balanceOf(amm.address)
	// 	const balance1 = await kAsset.balanceOf(amm.address)

	// 	const amount = expand(10)
	// 	await w(stableToken.approve(amm.address, amount))

	// 	const kAssetBefore = await kAsset.balanceOf(owner.address)

	// 	// uint256 numerator = amountIn.mul(reserveOut);
	// 	// uint256 denominator = reserveIn.mul(1000).add(amountIn);
	// 	// amountOut = numerator / denominator;
	// 	const numerator = amount.mul(balance1)
	// 	const denominator = balance0.add(amount)
	// 	const expectedOut = numerator.div(denominator)
	// 	await w(amm.swapExact(amount, stableToken.address))

	// 	const kAssetAfter = await kAsset.balanceOf(owner.address)
	// 	expect(kAssetBefore.lt(kAssetAfter)).to.be.true
	// 	expect(kAssetAfter).to.equal(expectedOut)
	// })
})
