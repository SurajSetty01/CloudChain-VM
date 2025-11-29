const hre = require("hardhat");

async function main() {
    const Factory = await hre.ethers.getContractFactory("VMAccess");
    const contract = await Factory.deploy();
    await contract.deployed();

    console.log("Deployed at:", contract.address);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
