import { ethers } from "hardhat";

import * as dotenv from "dotenv";
dotenv.config();

const TOKEN_RATIO = 1;
const BET_PRICE = 1;
const BET_FEE = 0.2;
const contract_ERC20 = '0xbCFb1F3796dB8B1855905ed925F88e0205126B74';
async function main() {

    const Lottery = await ethers.getContractFactory("Lottery");
    const lotteryContract = await Lottery.deploy(TOKEN_RATIO,
        ethers.utils.parseEther(BET_PRICE.toString()),
        ethers.utils.parseEther(BET_FEE.toString()), contract_ERC20);
    await lotteryContract.deployed();
    console.log(`The Lottery contract was deployed at the address ${lotteryContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});