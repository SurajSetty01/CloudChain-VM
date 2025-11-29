// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VMAccess {

    mapping(address => uint256) public expiry;

    function purchaseAccess(uint256 durationMinutes) external payable {
        require(durationMinutes > 0, "Invalid duration");

        // price = duration * 1e14 (0.0001 ETH per unit) just placeholder
        uint256 requiredValue = durationMinutes * 1e14; 
        require(msg.value >= requiredValue, "Insufficient ETH sent");

        uint256 extra = msg.value - requiredValue;
        if (extra > 0) {
            payable(msg.sender).transfer(extra);
        }

        // Add minutes to expiry
        uint256 durationSeconds = durationMinutes * 60;
        uint256 newExpiry = block.timestamp + durationSeconds;

        // Extend if existing
        if (expiry[msg.sender] > block.timestamp) {
            expiry[msg.sender] += durationSeconds;
        } else {
            expiry[msg.sender] = newExpiry;
        }
    }

    function hasAccess(address user) external view returns (bool) {
        return expiry[user] > block.timestamp;
    }
}
