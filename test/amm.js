const { expect } = require("chai");
const { utils, BigNumber } = require("ethers");

const nullAddress = "0x0000000000000000000000000000000000000000";

function toDecimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

function sqrt(value) {
  const ONE = BigNumber.from(1);
  const TWO = BigNumber.from(2);
  x = BigNumber.from(value);
  let z = x.add(ONE).div(TWO);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(TWO);
  }
  return y;
}

const ONE = toDecimals(1);
const TEN = toDecimals(10);

describe("AMM", () => {
  let amm;
  let kAsset;
  let cUSD;

  let owner;
  let address0;
  let address1;

  beforeEach(async () => {
    [owner, address0, address1] = await ethers.getSigners();

    const KAsset = await ethers.getContractFactory("KAsset");
    kAsset = await KAsset.deploy(owner.address, "Kresko Tesla", "kTSLA");

    const CUSD = await ethers.getContractFactory("cUSD");
    cUSD = await CUSD.deploy();

    const AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(nullAddress, cUSD.address, kAsset.address);

    await kAsset.deployed();
    await cUSD.deployed();
    await amm.deployed();

    await kAsset.mint(owner.address, TEN);

    await addLiquidity(100, 10);

    expect(await cUSD.balanceOf(amm.address)).to.equal(toDecimals(100));
    expect(await kAsset.balanceOf(amm.address)).to.equal(toDecimals(10));

    const expectedLiquidity = sqrt(
      BigNumber.from(toDecimals(100).mul(toDecimals(10)))
    );
    expect(await amm.balanceOf(owner.address)).to.equal(expectedLiquidity);
  });

  async function addLiquidity(amount0, amount1) {
    await cUSD.transfer(amm.address, toDecimals(amount0));
    await kAsset.transfer(amm.address, toDecimals(amount1));
    await amm.mint();
  }

  it("swaps", async () => {
    const amount = ONE;
    await cUSD.transfer(amm.address, amount);

    const balance0 = await cUSD.balanceOf(amm.address);
    const balance1 = await kAsset.balanceOf(amm.address);

    const expectedOut = balance0.mul(balance1).div(balance0.add(amount));
    await amm.swap(0, expectedOut);

    console.log(balance0.toString(), balance1.toString());

    expect(await cUSD.balanceOf(owner.address)).to.equal(balance0.sub(ONE));
    // expect(await kAsset.balanceOf(owner.address)).to.equal(0);
  });
});
