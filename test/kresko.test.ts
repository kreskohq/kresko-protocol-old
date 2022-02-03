import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/src/signers'
import { expect } from 'chai'
import { ethers as ethersType } from 'ethers'
import { ethers } from 'hardhat'
import { sign } from 'node:crypto'
import { AMM } from '../typechain/AMM'
import { ERC20Harness } from '../typechain/ERC20Harness'
import { IOracle } from '../typechain/IOracle'
import { KAsset } from '../typechain/KAsset'
import { Kresko } from '../typechain/Kresko'
import { Reserve } from '../typechain/Reserve'
import { COLLATERAL_RATIO_1_POINT_5 } from './constants'
import {
	deployBasicOracle,
	deployERC20Harness,
	deployKAssetAndFriends,
	deployKresko
} from '../deploy-utils'

describe('Kresko', () => {
	let signers: SignerWithAddress[]
	let stableToken: ERC20Harness
	let oracle: IOracle
	let kresko: Kresko
	let amm: AMM
	let kAsset: KAsset
	let reserve: Reserve

	beforeEach(async () => {
		// Hack because for some reason TypeScript isn't happy
		signers = ((await ethers.getSigners()) as unknown) as SignerWithAddress[]

		stableToken = await deployERC20Harness()
		oracle = await deployBasicOracle()
		kresko = await deployKresko(stableToken)
		const deployedKAssetAndFriends = await deployKAssetAndFriends(
			stableToken,
			kresko,
			oracle,
			'Kresko TSLA',
			'kTSLA'
		)
		amm = deployedKAssetAndFriends.amm
		kAsset = deployedKAssetAndFriends.kAsset
		reserve = deployedKAssetAndFriends.reserve

		await kresko.listKAsset(
			kAsset.address,
			amm.address,
			reserve.address,
			oracle.address,
			COLLATERAL_RATIO_1_POINT_5
		)
	})

	const setBalanceAndDepositCollateral = async (
		signer: SignerWithAddress,
		amount: ethersType.BigNumber
	) => {
		// Give signer1 a StableToken balance
		stableToken.setBalance(signer.address, amount)
		// Make sure it has the balance
		expect((await stableToken.balanceOf(signer.address)).eq(amount))
		await stableToken.connect(signer).approve(kresko.address, amount)
		// Approve the StableToken to kresko
		await kresko.connect(signer).depositCollateral(kAsset.address, amount)
		// Make sure signer1 no longer has a StableToken balance
		expect((await stableToken.balanceOf(signer.address)).eq(0))
	}

	describe('collateral percent ownership', () => {
		describe('getTotalCollateralAmount()', async () => {
			it('returns 0 when no collateral has ever been deposited', async () => {
				const totalCollateralAmount = await kresko.getTotalCollateralAmount(kAsset.address)
				expect(totalCollateralAmount).to.equal(ethers.BigNumber.from(0))
			})

			it('returns the total collateral amount when collateral has been deposited with no trading', async () => {
				// Add amount1 from signer[1]
				const amount1 = ethers.BigNumber.from('123456789')
				await setBalanceAndDepositCollateral(signers[1], amount1)
				expect(await kresko.getTotalCollateralAmount(kAsset.address)).to.equal(amount1)

				// Add amount2 from signer[2]
				const amount2 = ethers.BigNumber.from('987654321')
				await setBalanceAndDepositCollateral(signers[2], amount2)
				expect(await kresko.getTotalCollateralAmount(kAsset.address)).to.equal(amount1.add(amount2))
			})
		})

		describe('getCollateralAmountOwned()', async () => {
			it('returns 0 when no collateral has ever been deposited by the user', async () => {
				const collateralAmountOwned = await kresko.getCollateralAmountOwned(
					kAsset.address,
					'0xf00d000000000000000000000000000000000000'
				)
				expect(collateralAmountOwned).to.equal(ethers.BigNumber.from(0))
			})

			it('returns the collateral amount owned when multiple users have deposited and no trades have occurred', async () => {
				//
				// signers[1] adds amount1
				//
				const amount1 = ethers.BigNumber.from('123456789')
				// Account for the minimum 1000 wei of liquidity
				const amount1MinusMinLiquidity = amount1.sub('1000')
				await setBalanceAndDepositCollateral(signers[1], amount1)
				expect(await kresko.getCollateralAmountOwned(kAsset.address, signers[1].address)).to.equal(
					amount1MinusMinLiquidity
				)

				//
				// signers[2] adds amount2
				//
				const amount2 = ethers.BigNumber.from('987654321')
				await setBalanceAndDepositCollateral(signers[2], amount2)
				// signers[1] is unaffected
				expect(await kresko.getCollateralAmountOwned(kAsset.address, signers[1].address)).to.equal(
					amount1MinusMinLiquidity
				)
				// signers[2] is correct
				expect(await kresko.getCollateralAmountOwned(kAsset.address, signers[2].address)).to.equal(
					amount2
				)

				//
				// signers[1] adds amount3
				//
				const amount3 = ethers.BigNumber.from('420694206942069')
				await setBalanceAndDepositCollateral(signers[1], amount3)
				// signers[2] is unaffected
				expect(await kresko.getCollateralAmountOwned(kAsset.address, signers[2].address)).to.equal(
					amount2
				)
				// signers[1] is correct
				expect(await kresko.getCollateralAmountOwned(kAsset.address, signers[1].address)).to.equal(
					amount1MinusMinLiquidity.add(amount3)
				)
			})
		})
	})

	describe('kAsset minting', () => {
		describe('mint()', () => {
			it('mints the kAsset directly to the sender when properly collateralized', async () => {
				// Set the oracle price to 100
				await oracle.setValue(ethers.utils.parseEther('100'))

				// Ensure our kAsset start balances are 0
				expect(await kAsset.balanceOf(signers[0].address)).to.equal(
					ethers.BigNumber.from('0')
				)
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.BigNumber.from('0')
				)

				// This is the first collateral deposited-- recall how there is a minimum liquidity
				// amount enforced, which means the depositor gets a very teeny tiny portion of their
				// deposited collateral as off limits, so we must deposit slightly higher than the
				// very minimum required.
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('150.00001'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[0]).mint(kAsset.address, ethers.utils.parseEther('1'))
				// Ensure we now have 1 kAsset (with 18 decimals)
				expect(await kAsset.balanceOf(signers[0].address)).to.equal(
					ethers.utils.parseEther('1')
				)
				// Ensure the protocol knows we have debt of 1 kAsset
				expect(await kresko.kAssetDebt(kAsset.address, signers[0].address)).to.equal(
					ethers.utils.parseEther('1')
				)

				// Deposit 300 stable token (the minnimum needed to mint 2 kAssets).
				// Because collateral has been deposited by signer[0] already, we can actually get
				// away with depositing the very minimum amount.
				await setBalanceAndDepositCollateral(signers[1], ethers.utils.parseEther('300'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[1]).mint(kAsset.address, ethers.utils.parseEther('2'))
				// Ensure we now have 1 kAsset (with 18 decimals)
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.utils.parseEther('2')
				)
				// Ensure the protocol knows we have debt of 2 kAssets
				expect(await kresko.kAssetDebt(kAsset.address, signers[1].address)).to.equal(
					ethers.utils.parseEther('2')
				)

				// Deposit 151 stable token just to illustrate we can deposit more than the min
				// and also mint more from the same accounnt
				await setBalanceAndDepositCollateral(signers[1], ethers.utils.parseEther('151'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[1]).mint(kAsset.address, ethers.utils.parseEther('1'))
				// Ensure we now have 3 kAssets (with 18 decimals)
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.utils.parseEther('3')
				)
				// Ensure the protocol knows we have debt of 3 kAssets
				expect(await kresko.kAssetDebt(kAsset.address, signers[1].address)).to.equal(
					ethers.utils.parseEther('3')
				)
			})

			it('reverts when the sender does not have enough collateral', async () => {
				// Set the oracle price to 100
				await oracle.setValue(ethers.utils.parseEther('100'))

				// Ensure our kAsset start balances are 0
				expect(await kAsset.balanceOf(signers[0].address)).to.equal(
					ethers.BigNumber.from('0')
				)
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.BigNumber.from('0')
				)
				// Try when signers[0] has no collateral
				await expect(kresko.mint(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')

				// Try when signers[0] has some collateral but not enough
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('149'))
				await expect(kresko.mint(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')

				// Let's actually let signers[0] mint...
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('151'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.mint(kAsset.address, ethers.utils.parseEther('1'))
				// And now try to mint more, despite not having enough
				await expect(kresko.mint(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')
			})
		})

		describe('mintAsAMMLiquidity()', () => {
			const expectSignersHaveNoBalance = async () => {
				expect(await kAsset.balanceOf(signers[0].address)).to.equal(
					ethers.BigNumber.from('0')
				)
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.BigNumber.from('0')
				)
			}

			it('mints the kAsset to the AMM when the sender is properly collateralized', async () => {
				// Set the oracle price to 100
				await oracle.setValue(ethers.utils.parseEther('100'))

				const expectAmmBucketSizes = async (kAssetBucket: ethersType.BigNumber, stableTokenBucket: ethersType.BigNumber) => {
					// KAsset
					expect(await kAsset.balanceOf(amm.address)).to.equal(
						kAssetBucket
					)
					expect(await amm.kAssetBucket()).to.equal(
						kAssetBucket
					)
					// StableToken
					expect(await stableToken.balanceOf(amm.address)).to.equal(
						stableTokenBucket
					)
					expect(await amm.stableTokenBucket()).to.equal(
						stableTokenBucket
					)
				}
				// Ensure our kAsset start balances are 0
				await expectSignersHaveNoBalance()
				// Expect the AMM to not have any kAsset or StableToken
				await expectAmmBucketSizes(ethers.BigNumber.from('0'), ethers.BigNumber.from('0'))

				// This is the first collateral deposited-- recall how there is a minimum liquidity
				// amount enforced, which means the depositor gets a very teeny tiny portion of their
				// deposited collateral as off limits, so we must deposit slightly higher than the
				// very minimum required.
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('150.00001'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[0]).mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))
				// Ensure we still have 0 kAssets
				expect(await kAsset.balanceOf(signers[0].address)).to.equal(
					ethers.utils.parseEther('0')
				)
				// Ensure the protocol knows we have debt of 1 kAsset
				expect(await kresko.kAssetDebt(kAsset.address, signers[0].address)).to.equal(
					ethers.utils.parseEther('1')
				)
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()
				// Ensure the kAsset balance and bucket size of the AMM is now 1
				// and StableToken balance and bucket size is 100 (the oracle price)
				await expectAmmBucketSizes(ethers.utils.parseEther('1'), ethers.utils.parseEther('100'))

				// Deposit 300 stable token (the minnimum needed to mint 2 kAssets).
				// Because collateral has been deposited by signer[0] already, we can actually get
				// away with depositing the very minimum amount.
				await setBalanceAndDepositCollateral(signers[1], ethers.utils.parseEther('300'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[1]).mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('2'))
				// Ensure still have 0 kAsset
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.utils.parseEther('0')
				)
				// Ensure the protocol knows we have debt of 2 kAssets
				expect(await kresko.kAssetDebt(kAsset.address, signers[1].address)).to.equal(
					ethers.utils.parseEther('2')
				)
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()
				// Ensure the kAsset balance and bucket size of the AMM is now 3
				// and StableToken balance and bucket size is 300 (according to the oracle price)
				await expectAmmBucketSizes(ethers.utils.parseEther('3'), ethers.utils.parseEther('300'))

				// Deposit 151 stable token just to illustrate we can deposit more than the min
				// and also mint more from the same accounnt
				await setBalanceAndDepositCollateral(signers[1], ethers.utils.parseEther('151'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.connect(signers[1]).mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))
				// Ensure we still have 0 kAssets
				expect(await kAsset.balanceOf(signers[1].address)).to.equal(
					ethers.utils.parseEther('0')
				)
				// Ensure the protocol knows we have debt of 3 kAssets
				expect(await kresko.kAssetDebt(kAsset.address, signers[1].address)).to.equal(
					ethers.utils.parseEther('3')
				)
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()
				// Ensure the kAsset balance and bucket size of the AMM is now 4
				// and StableToken balance and bucket size is 400 (according to the oracle price)
				await expectAmmBucketSizes(ethers.utils.parseEther('4'), ethers.utils.parseEther('400'))
			})

			it('reverts when the sender does not have enough collateral', async () => {
				// Set the oracle price to 100
				await oracle.setValue(ethers.utils.parseEther('100'))

				// Ensure our kAsset start balances are 0
				await expectSignersHaveNoBalance()
				// Try when signers[0] has no collateral
				await expect(kresko.mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()

				// Try when signers[0] has some collateral but not enough
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('149'))
				await expect(kresko.mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()

				// Let's actually let signers[0] mint...
				await setBalanceAndDepositCollateral(signers[0], ethers.utils.parseEther('151'))
				// Mint 1 kAsset (with 18 decimals)
				await kresko.mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))
				// And now try to mint more, despite not having enough
				await expect(kresko.mintAsAMMLiquidity(kAsset.address, ethers.utils.parseEther('1'))).to.be.revertedWith('Kresko: not enough collateral')
				// Ensure our kAsset start balances are still 0
				await expectSignersHaveNoBalance()
			})
		})
	})
})
