import { ethers } from "hardhat";

import * as dotenv from "dotenv";
dotenv.config();
async function main() {

    const Lottery = await ethers.getContractFactory("LotteryErc20");
    const lotteryContract = await Lottery.deploy('Lottery', 'LTK');

    console.log("Deploying Lottery ERC20 contract");
    await lotteryContract.deployed();
    console.log(
        `The Lottery ERC20 contract was deployed at the address ${lotteryContract.address}`
    );

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});