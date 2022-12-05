import React from "react";
import { useBet } from "../../hooks/useBet";

export default function Bets() {
    const {write, isLoading, setIsLoading} = useBet();
  return (
    <div>
        <button disabled={!write || isLoading} onClick={() => {
                setIsLoading(true);
                write?.();
        }}
        className="disabled:opacity-25 enabled:hover:scale-105 transform transition bg-blue-500 hover:bg-primary text-white font-bold py-2 px-4 rounded"
        type="button"
        >
            open bets
        </button>
    </div>
  );
}
