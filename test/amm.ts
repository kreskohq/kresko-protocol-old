import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { deployKAssetAndFriends, deployKresko } from "./utils";
import { Kresko } from "../typechain/Kresko";
import { AMM } from "../typechain/AMM";
import { KAsset } from "../typechain/KAsset";

import { expand, sqrt } from "./maths";

async function w(x: Promise<any>) {
  await (await x).wait();
}

describe("AMM", () => {
  let kresko: Kresko;

  let amm: AMM;
  let kAsset: KAsset;
  let cUSD;

  let owner;
  let user0;
  let user1;

  beforeEach(async () => {
    kresko = await deployKresko();
    ({ amm, kAsset } = await deployKAssetAndFriends(
      kresko,
      "Kresko TSLA",
      "kTSLA"
    ));
    [owner, user0, user1] = await ethers.getSigners();

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
