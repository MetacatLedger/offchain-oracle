// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./OracleBase.sol";
import "../interfaces/IUniswapV2Pair.sol";


contract UniswapV2LikeOracle is IOracle {
    function getRate(IERC20 srcToken, IERC20 dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {
        rate = 1;
        weight = 1;
    }
}

