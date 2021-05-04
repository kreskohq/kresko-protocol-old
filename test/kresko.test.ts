import { expect } from 'chai'
import { ethers } from 'hardhat'
import { AMM } from '../typechain/AMM'
import { ERC20Harness } from '../typechain/ERC20Harness'
import { KAsset } from '../typechain/KAsset'
import { Kresko } from '../typechain/Kresko'
import { Reserve } from '../typechain/Reserve'
import { deployERC20Harness, deployKAssetAndFriends, deployKresko } from './utils'

describe('Kresko', () => {
	let stableToken: ERC20Harness
	let kresko: Kresko

	let amm: AMM
	let kAsset: KAsset
	let reserve: Reserve

	beforeEach(async () => {
		stableToken = await deployERC20Harness()
		kresko = await deployKresko(stableToken)
		const deployedKAssetAndFriends = await deployKAssetAndFriends(
			stableToken,
			kresko,
			'Kresko TSLA',
			'kTSLA'
		)
		amm = deployedKAssetAndFriends.amm
		kAsset = deployedKAssetAndFriends.kAsset
		reserve = deployedKAssetAndFriends.reserve

		await kresko.listKAsset(
			kAsset.address,
			amm.address,
			reserve.address
		)
	})

	describe('collateral percent ownership', () => {
		describe('getTotalCollateralAmount()', async () => {
			it('returns 0 when no collateral has ever been deposited', async () => {
				const totalCollateralAmount = await kresko.getTotalCollateralAmount(
					kAsset.address
				)
				expect(totalCollateralAmount.eq(
					ethers.BigNumber.from(0)
				))
			})
		})

		describe('getCollateralAmountOwned()', async () => {
			it('returns 0 when no collateral has ever been deposited by the user', async () => {
				const collateralAmountOwned = await kresko.getCollateralAmountOwned(
					kAsset.address,
					'0xf00d000000000000000000000000000000000000'
				)
				expect(collateralAmountOwned.eq(
					ethers.BigNumber.from(0)
				))
			})
		})
	})
});