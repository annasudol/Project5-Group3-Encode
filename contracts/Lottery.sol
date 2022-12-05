// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryErc20} from "./LotteryErc20.sol";
import "hardhat/console.sol";


contract Lottery is Ownable {
    LotteryErc20 public paymentToken;
    uint256 public purchaseRatio;
    uint256 public betPrice;
    uint256 public betFee;
    uint256 public prizePool;
    uint256 public ownerPool;
    bool public betsOpen;
    uint256 public betsClosingTime;
    mapping(address => uint256) public prize;

    address[] _slots;

    constructor(uint256 _purchaseRatio, uint256 _betPrice, uint256 _betFee, address ERC20address) {
        paymentToken = LotteryErc20(ERC20address);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;
    }

    modifier whenBetsClosed() {
        require(!betsOpen, "Lottery is open");
        _;
    }

    modifier whenBetsOpen() {
        require(
            betsOpen && block.timestamp < betsClosingTime,
            "Lottery is closed"
        );
        _;
    }

    function openBets(uint256 closingTime) public onlyOwner whenBetsClosed {
        require(closingTime > block.timestamp, "Closing time must be in the future");
        betsClosingTime = closingTime;
        betsOpen = true;
    }

    function purchaseTokens() public payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    function bet() public whenBetsOpen {
        ownerPool += betFee;
        prizePool += betPrice;
        _slots.push(msg.sender);
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
    }

    function betMany(uint256 times) public whenBetsOpen {
        require(times > 1, "To use when placing several bets at once, use bet() for single bet");
        uint256 _betFee = times * betFee;
        uint256 _betPrice = times * betPrice;
        ownerPool += _betFee;
        prizePool += _betPrice;
        while (times > 0) {
            _slots.push(msg.sender);
            times--;
        }
        paymentToken.transferFrom(
            msg.sender,
            address(this),
            _betFee + _betPrice
        );
    }

    function closeLottery() public {
        require(block.timestamp >= betsClosingTime, "Too soon to close");
        require(betsOpen == true, "Already closed");
        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete (_slots);
        }
        betsOpen = false;
    }

    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.difficulty;
    }

    function prizeWithdraw(uint256 amount) public {
        require(amount <= prize[msg.sender], "Not enough prize");
        prize[msg.sender] -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    function ownerWithdraw(uint256 amount) public onlyOwner {
        require(amount <= ownerPool, "Not enough fees collected");
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    function returnTokens(uint256 amount) public {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / purchaseRatio);
    }
}