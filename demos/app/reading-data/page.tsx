"use client";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import React, { useState } from "react";

function ReadingData() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isExecutable, setIsExecutable] = useState(false);
  const [displayAddress, setDisplayAddress] = useState("");

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const publicKey = new PublicKey(address);
      const connection = new Connection(clusterApiUrl("devnet"));
      const info = await connection.getAccountInfo(publicKey);
      setBalance(info?.lamports || 0);
      setIsExecutable(info?.executable || false);
      setDisplayAddress(address);
    } catch (error: any) {
      setDisplayAddress("");
      setBalance(0);
      alert(error.message);
    }
  };

  const handleAddressInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddress(event.target.value);
  };

  return (
    <div className="min-w-lg border border-white">
      <header className="text-3xl py-5">
        <p className="text-center">Start Your Solana Journey</p>
      </header>
      <section className="content-center">
        <div className="">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center min-w-full items-center"
          >
            <input
              id="public-key"
              className="border w-2/3 border-white text-center text-gray-800 py-2 px-4 rounded-lg"
              type="text"
              placeholder="Public Address, e.g. 7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp"
              name="firstName"
              value={address}
              onChange={handleAddressInputChange}
            />
            <br />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              Check SOL Balance
            </button>
          </form>
        </div>
        <div className="max-w-fit p-5 mx-5 border border-white rounded-md mb-4">
          <p>{`Address: ${displayAddress}`}</p>
          <p>{`Balance: ${(balance / LAMPORTS_PER_SOL).toLocaleString(
            "en-US"
          )} SOL`}</p>
          <p>
            Executable: {displayAddress ? (isExecutable ? `YES` : `NO`) : "-"}
          </p>
        </div>
      </section>
    </div>
  );
}

export default ReadingData;
