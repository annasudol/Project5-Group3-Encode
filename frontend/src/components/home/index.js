import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { usePurchaseTokens } from "../../hooks/purchaseTokens";

import Row from "./row";

function Home() {
  const {balance, symbol, write, isLoading, setIsLoading} = usePurchaseTokens();

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg">
        <nav className=" flex items-center justify-end px-5 py-3 mb-3">
          <ConnectButton showBalance={false} />
        </nav>
        <div className="flex flex-wrap ml-14">
          <div>
            <Row label="Token symbol:" value={!symbol ? "" : symbol} />
            <Row
              label="User balance:"
              value={!balance ? "" : balance}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center w-full max-w-sm">
            <button
              disabled={!write || isLoading}
              onClick={() => {
                setIsLoading(true);
                write?.();
              }}
              className="disabled:opacity-25 enabled:hover:scale-105 transform transition bg-blue-500 hover:bg-primary text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              purchase tokens
            </button>
            {balance > 0 && (
              <button
                disabled={!write || isLoading}
                onClick={() => {
                  setIsLoading(true);
                  write?.();
                }}
                className="disabled:opacity-25 enabled:hover:scale-105 transform transition bg-blue-500 hover:bg-primary text-white font-bold py-2 px-4 rounded"
                type="button"
              >
                return tokens
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
