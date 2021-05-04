import { expect } from 'chai'
import { ethers } from 'hardhat'
import { AMM } from '../typechain/AMM';
import { KAsset } from '../typechain/KAsset';
import { Kresko } from '../typechain/Kresko';
import { Reserve } from '../typechain/Reserve';
import { deployKAssetAndFriends, setupKreskoWithKAsset } from './utils'

describe('Kresko', () => {
	let kresko: Kresko

	let amm: AMM
	let kAsset: KAsset
	let reserve: Reserve

	beforeEach(async () => {
		kresko = (await setupKreskoWithKAsset()).kresko

		// const deployedKAssetAndFriends = await deployKAssetAndFriends(
		// 	kresko,
		// 	'Kresko TSLA',
		// 	'kTSLA'
		// )
		// amm = deployedKAssetAndFriends.amm
		// kAsset = deployedKAssetAndFriends.kAsset
		// reserve = deployedKAssetAndFriends.reserve

		// await kresko.listKAsset(
		// 	kAsset.address,
		// 	amm.address,
		// 	reserve.address
		// )
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
	})
});