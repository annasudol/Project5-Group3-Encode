import { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { contractLotteryAddress } from "../values";

export const useBet = () => {
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

  const { config } = usePrepareContractWrite({
    address: contractLotteryAddress,
    abi: [{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num_of_days",
                "type": "uint256"
            }
        ],
        "name": "openBets",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    functionName: "openBets",
    args: [10]
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
      openSnackbar('Opened bets');
      setIsLoading(false);
    },
    onError(error) {
      setIsLoading(false);
    },
  });

  return {
    isLoading,
    setIsLoading,
    write,
  };
};
