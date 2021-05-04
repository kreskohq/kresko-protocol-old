import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const nullAddress = "0x0000000000000000000000000000000000000000";

function expand(n: number) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

function sqrt(value) {
  const ONE = BigNumber.from(1);
  const TWO = BigNumber.from(2);
  const x = BigNumber.from(value);
  let z = x.add(ONE).div(TWO);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(TWO);
  }
  return y;
}

async function w(x: Promise<any>) {
  await (await x).wait();
}

const ONE = expand(1);
const TEN = expand(10);

describe("AMM", () => {
  let amm;
  let kAsset;
  let cUSD;

  let owner;
  let user0;
  let user1;

  beforeEach(async () => {
    [owner, user0, user1] = await ethers.getSigners();

    const KAsset = await ethers.getContractFactory("KAsset");
    kAsset = await KAsset.deploy(owner.address, "Kresko Tesla", "kTSLA");
    const CUSD = await ethers.getContractFactory("cUSD");
    cUSD = await CUSD.deploy();
    const AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(nullAddress, cUSD.address, kAsset.address);

    await kAsset.deployed();
    await cUSD.deployed();
    await amm.deployed();

    await w(kAsset.mint(owner.address, expand(1000)));
    await w(cUSD.mint(owner.address, expand(100_000)));
    await w(cUSD.mint(user0.address, expand(100_000)));

    await addLiquidity(100, 10);

    const expectedLiquidity = sqrt(BigNumber.from(expand(100).mul(expand(10))));
    expect(await amm.balanceOf(owner.address)).to.equal(expectedLiquidity);
  });

  async function addLiquidity(amount0, amount1) {
    await w(cUSD.transfer(amm.address, expand(amount0)));
    await w(kAsset.transfer(amm.address, expand(amount1)));
    await w(amm.mint());
  }

  it("swaps", async () => {
    const balance0 = await cUSD.balanceOf(amm.address);
    const balance1 = await kAsset.balanceOf(amm.address);

    const amount = expand(10);
    await w(cUSD.approve(amm.address, amount));

    const kAssetBefore = await kAsset.balanceOf(owner.address);

    // uint256 numerator = amountIn.mul(reserveOut);
    // uint256 denominator = reserveIn.mul(1000).add(amountIn);
    // amountOut = numerator / denominator;
    const numerator = amount.mul(balance1);
    const denominator = balance0.add(amount);
    const expectedOut = numerator.div(denominator);
    await w(amm.swapExact(amount, cUSD.address));

    console.log(
      (await kAsset.balanceOf(owner.address)).toString(),
      expectedOut.toString()
    );

    const kAssetAfter = await kAsset.balanceOf(owner.address);
    expect(kAssetBefore.lt(kAssetAfter)).to.be.true;
    expect(kAssetAfter).to.equal(expectedOut);
  });
});
