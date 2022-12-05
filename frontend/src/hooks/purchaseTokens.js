import { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import {
  usePrepareContractWrite,
  useBalance,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers"

import { contractLotteryAddress, contractERC20yAddress } from "../values";

export const usePurchaseTokens = () => {
  const [openSnackbar] = useSnackbar({
    position: "top-center",
    style: {
      backgroundColor: "#92C47C",
      color: "#000000",
    },
    closeStyle: {
      color: "#000000",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: contractERC20yAddress,
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    address: contractLotteryAddress,
    abi: [{
        "inputs": [],
        "name": "purchaseTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }],
    functionName: "purchaseTokens",
    overrides: {
        from: address,
        value: ethers.utils.parseEther('0.1'),
      },
  });
  const { data, write } = useContractWrite({
    ...config,
    onError(error) {
      setIsLoading(false);
    },
  });
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      openSnackbar('Purchased 0.1 tokens');
      setIsLoading(false);
    },
    onError(error) {
      setIsLoading(false);
    },
  });

  return {
    isLoading,
    setIsLoading,
    balance: balanceData?.formatted,
    symbol: balanceData?.symbol,
    write,
  };
};
