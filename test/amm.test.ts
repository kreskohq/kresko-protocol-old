import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { AMM } from '../typechain/AMM'
import { BasicOracle } from '../typechain/BasicOracle'
import { ERC20Harness } from '../typechain/ERC20Harness'
import { IOracle } from '../typechain/IOracle'
import { KAsset } from '../typechain/KAsset'
import { Kresko } from '../typechain/Kresko'
import { Reserve } from '../typechain/Reserve'
import { COLLATERAL_RATIO_1_POINT_5 } from './constants'
import { e18 } from './maths'
import {
	deployBasicOracle,
	deployERC20Harness,
	deployKAssetAndFriends,
	deployKresko
} from '../deploy-utils'

describe('AMM', () => {
	let kresko: Kresko
	let stableToken: ERC20Harness

	let amm: AMM
	let kAsset: KAsset
	let reserve: Reserve
	let oracle: IOracle

	let owner: SignerWithAddress
	let user0: SignerWithAddress
	let user1: SignerWithAddress

	beforeEach(async () => {
		stableToken = await deployERC20Harness()
		kresko = await deployKresko(stableToken)
		oracle = await deployBasicOracle()
		;({ amm, kAsset, reserve } = await deployKAssetAndFriends(
			stableToken,
			kresko,
			oracle,
			'Kresko TSLA',
			'kTSLA'
		))

		await kresko.listKAsset(
			kAsset.address,
			amm.address,
			reserve.address,
			oracle.address,
			COLLATERAL_RATIO_1_POINT_5
		)
		await ((oracle as unknown) as BasicOracle).setValue(10)
		;[owner, user0, user1] = await ethers.getSigners()

		// Approve the StableToken to kresko
		await stableToken.setBalance(owner.address, e18(100_000))
		await stableToken.setBalance(user0.address, e18(100_000))
		await stableToken.setBalance(user1.address, e18(100_000))

		// handling minimum shares 1000
		await stableToken.approve(kresko.address, 1000)
		await kresko.depositCollateral(kAsset.address, 1000)

		// get kAssets
		await stableToken.connect(user0).approve(kresko.address, e18(300))
		await kresko.connect(user0).depositCollateral(kAsset.address, e18(300))
		await kresko.connect(user0).mintAsAMMLiquidity(kAsset.address, e18(200))
	})

	it('swaps', async () => {
		const stableBucket = await stableToken.balanceOf(amm.address)
		const kAssetBucket = await kAsset.balanceOf(amm.address)

		const amount = e18(10)
		await stableToken.connect(user1).approve(amm.address, amount)

		const kAssetBefore = await kAsset.balanceOf(user1.address)
		await amm.connect(user1).swap(amount, stableToken.address)
		const kAssetAfter = await kAsset.balanceOf(user1.address)

		expect(kAssetAfter.gt(kAssetBefore)).to.be.true
		// uint256 numerator = amountIn.mul(reserveOut);
		// uint256 denominator = reserveIn.mul(1000).add(amountIn);
		// amountOut = numerator / denominator;
		const numerator = amount.mul(kAssetBucket)
		const denominator = stableBucket.add(amount)
		const expectedOut = numerator.div(denominator)
		expect(kAssetAfter).to.equal(expectedOut)
	})
})
