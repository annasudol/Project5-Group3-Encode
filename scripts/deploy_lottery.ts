import { ethers } from "hardhat";

import * as dotenv from "dotenv";
dotenv.config();

const TOKEN_RATIO = 100;
const BET_PRICE = 100;
const BET_FEE = 10
const contract_ERC20 = '0xbCFb1F3796dB8B1855905ed925F88e0205126B74';
async function main() {

    const Lottery = await ethers.getContractFactory("Lottery");
    const lotteryContract = await Lottery.deploy(TOKEN_RATIO,
        100,
        10, contract_ERC20);
    await lotteryContract.deployed();
    console.log(`The Lottery contract was deployed at the address ${lotteryContract.address} with values BET_PRICE:${ethers.utils.parseEther(BET_PRICE.toString())}, BET_FEE: ${ethers.utils.parseEther(BET_FEE.toString())}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
