// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CloudVM {
    mapping(address => uint256) public expiryTime;

    // Backend will define price calculation logic.
    // we accept whatever value frontend sends.
    function purchaseAccess(uint256 durationMinutes) external payable {
        require(durationMinutes > 0, "Invalid duration");
        require(msg.value > 0, "Payment required");

        uint256 additionalSeconds = durationMinutes * 60;
        uint256 currentExpiry = expiryTime[msg.sender];

        if (block.timestamp >= currentExpiry) {
            expiryTime[msg.sender] = block.timestamp + additionalSeconds;
        } else {
            expiryTime[msg.sender] = currentExpiry + additionalSeconds;
        }
    }

    function expiry(address user) external view returns (uint256) {
        return expiryTime[user];
    }
}
