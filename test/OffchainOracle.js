const { ether, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens, assertRoughlyEquals } = require('./helpers.js');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

const BaseCoinWrapper = artifacts.require('BaseCoinWrapper');
const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapOracle = artifacts.require('UniswapOracle');
const MooniswapOracle = artifacts.require('MooniswapOracle');
const OffchainOracle = artifacts.require('OffchainOracle');
const AaveWrapperV1 = artifacts.require('AaveWrapperV1');
const AaveWrapperV2 = artifacts.require('AaveWrapperV2');
const MultiWrapper = artifacts.require('MultiWrapper');
const GasEstimator = artifacts.require('GasEstimator');

const ADAIV2 = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';

describe('OffchainOracle', async function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.expensiveOffachinOracle = await OffchainOracle.new(this.uniswapV2LikeOracle.address, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
        this.gasEstimator = await GasEstimator.new();
    });
    //
    // it('weth -> dai', async function () {
    //     const rate = await this.offchainOracle.getRate(tokens.WETH, tokens.DAI, true, true);
    //     console.log(rate.toString());
    //     expect(rate).to.be.bignumber.greaterThan(ether('1000'));
    // });
    //
    // it('eth -> dai', async function () {
    //     const rate = await this.offchainOracle.getRate(tokens.ETH, tokens.DAI, true, true);
    //     console.log(rate.toString());
    //     expect(rate).to.be.bignumber.greaterThan(ether('1000'));
    // });
    //
    // it('usdc -> dai', async function () {
    //     const rate = await this.offchainOracle.getRate(tokens.USDC, tokens.DAI, true, true);
    //     console.log(rate.toString());
    //     expect(rate).to.be.bignumber.greaterThan(ether('980000000000'));
    // });
    //
    // it('dai -> adai', async function () {
    //     const rate = await this.offchainOracle.getRate(tokens.DAI, ADAIV2, true, true);
    //     expect(rate).to.be.bignumber.equal(ether('1'));
    // });
    //
    // it('getRate(dai -> link)_GasCheck', async function () {
    //     const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address, this.expensiveOffachinOracle.contract.methods.getRate(tokens.DAI, tokens.LINK, true, true).encodeABI());
    //     assertRoughlyEquals('902388', result.gasUsed, 2);
    // });
    //
    // it('getRateToEth(dai)_ShouldHaveCorrectRate', async function () {
    //     const expectedRate = await this.offchainOracle.getRate(tokens.DAI, tokens.WETH, true, true);
    //     const actualRate = await this.offchainOracle.getRateToEth(tokens.DAI, true);
    //     assertRoughlyEquals(expectedRate, actualRate, 7);
    // });
    //
    // it('getRateToEth(dai)_GasCheck', async function () {
    //     const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address, this.expensiveOffachinOracle.contract.methods.getRateToEth(tokens.DAI, true).encodeABI());
    //     assertRoughlyEquals('1324140', result.gasUsed, 2);
    // });
    //
    // it('getRateDirect(dai -> link)_ShouldHaveCorrectRate', async function () {
    //     const expectedRate = await this.offchainOracle.getRate(tokens.DAI, tokens.LINK, true, true);
    //     const actualRate = await this.offchainOracle.getRate(tokens.DAI, tokens.LINK, false, false);
    //     assertRoughlyEquals(expectedRate, actualRate, 7);
    // });

    it('getRateDirect(dai -> link)_GasCheck', async function () {
        const result = await this.gasEstimator.gasCost(this.expensiveOffachinOracle.address, this.expensiveOffachinOracle.contract.methods.getRate(tokens.DAI, tokens.LINK, false, false).encodeABI());
        assert.isTrue(result.success, "success");
        assertRoughlyEquals('0', result.gasUsed, 2);
    });
});
