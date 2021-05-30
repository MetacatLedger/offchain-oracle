// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IWrapper.sol";
import "./MultiWrapper.sol";

contract OffchainOracle {
    address private oracle;
    address private connector;

    constructor(address _oracle, address _connector) {
        oracle = _oracle;
        connector = _connector;
    }

    function getRate(IERC20 srcToken, IERC20 dstToken, bool useSrcWrappers, bool useDstWrappers) external view returns (uint256 weightedRate) {
        IOracle(oracle).getRate(srcToken, dstToken, IERC20(connector));
        return 0;
    }
}
