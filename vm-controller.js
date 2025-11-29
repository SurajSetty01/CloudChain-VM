import { exec } from "child_process";
import ethersPkg from "ethers";   // <-- ethers v5 uses default import
const { ethers } = ethersPkg;

// Hardhat RPC
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ABI
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "expiry",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "hasAccess",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Hardhat account #0
const USER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

// Contract instance (v5 syntax)
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

async function loop() {
    try {
        const expiryBN = await contract.expiry(USER);
        const expiry = expiryBN.toNumber();
        const now = Math.floor(Date.now() / 1000);

        if (expiry <= now) {
            exec("docker stop ubuntu-xfce");
            console.log("⛔ Access expired → VM stopped");
        } else {
            exec("docker start ubuntu-xfce");
            console.log("✅ Access active → VM running");
        }

    } catch (err) {
        console.error("Error:", err);
    }

    setTimeout(loop, 5000);
}

// Start monitoring loop
loop();
