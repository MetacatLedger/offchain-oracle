// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IWrapper.sol";


contract MultiWrapper is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    event WrapperAdded(IWrapper connector);
    event WrapperRemoved(IWrapper connector);

    EnumerableSet.AddressSet private _wrappers;

    constructor(IWrapper[] memory existingWrappers) {
        for (uint256 i = 0; i < existingWrappers.length; i++) {
            require(_wrappers.add(address(existingWrappers[i])), "Wrapper already added");
            emit WrapperAdded(existingWrappers[i]);
        }
    }

    function wrappers() external view returns (IWrapper[] memory allWrappers) {
        allWrappers = new IWrapper[](_wrappers.length());
        for (uint256 i = 0; i < allWrappers.length; i++) {
            allWrappers[i] = IWrapper(_wrappers.at(i));
        }
    }

    function addWrapper(IWrapper wrapper) external onlyOwner {
        require(_wrappers.add(address(wrapper)), "Wrapper already added");
        emit WrapperAdded(wrapper);
    }

    function removeWrapper(IWrapper wrapper) external onlyOwner {
        require(_wrappers.remove(address(wrapper)), "Unknown wrapper");
        emit WrapperRemoved(wrapper);
    }

    function getWrappedTokens(IERC20 token) external view returns (IERC20[] memory wrappedTokens, uint256[] memory rates) {
        IERC20[] memory memWrappedTokens = new IERC20[](20);
        uint256[] memory memRates = new uint256[](20);
        uint256 len = 0;
        for (uint256 i = 0; i < _wrappers._inner._values.length; i++) {
            try IWrapper(_wrappers.at(i)).wrap(token) returns (IERC20 wrappedToken, uint256 rate) {
                memWrappedTokens[len] = wrappedToken;
                memRates[len] = rate;
                len += 1;
                for (uint256 j = 0; j < _wrappers._inner._values.length; j++) {
                    if (i != j) {
                        try IWrapper(_wrappers.at(j)).wrap(wrappedToken) returns (IERC20 wrappedToken2, uint256 rate2) {
                            bool used = false;
                            for (uint256 k = 0; k < len; k++) {
                                if (wrappedToken2 == memWrappedTokens[k]) {
                                    used = true;
                                    break;
                                }
                            }
                            if (!used) {
                                memWrappedTokens[len] = wrappedToken2;
                                memRates[len] = (rate * rate2)/1e18;
                                len += 1;
                            }
                        } catch { continue; }
                    }
                }
            } catch { continue; }
        }
        wrappedTokens = new IERC20[](len + 1);
        rates = new uint256[](len + 1);
        for (uint256 i = 0; i < len; i++) {
            wrappedTokens[i] = memWrappedTokens[i];
            rates[i] = memRates[i];
        }
        wrappedTokens[len] = token;
        rates[len] = 1e18;
    }
}
