"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

function InteractWithWallet() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(0);
      return;
    }
    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );
    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info?.lamports ?? 0);
    });
  }, [publicKey, connection]);

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      const receiverPublicKey = new PublicKey(receiverAddress);
      const senderPublicKey = new PublicKey(publicKey ?? "");
      const sendSolInstructions = SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction().add(sendSolInstructions);
      const signature = await sendTransaction(transaction, connection);
      alert(`TRANSFER SIGNATURE: ${signature}`);
    } catch (error: any) {
      alert(error.message);
    }
  };
  const handleAddressInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiverAddress(event.target.value);
  };

  const handleAmountInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(parseFloat(event.target.value));
  };

  return (
    <div className="min-w-lg border border-white">
      <header className="text-3xl py-5">
        <p className="text-center">Start Your Solana Journey</p>
      </header>
      <section className="content-center">
        <div className="flex justify-center">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </div>
        {connected && (
          <div className="flex flex-col justify-center my-5">
            <h1 className="text-2xl text-center mb-3">
              Send SOL to your friend!
            </h1>
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
                value={receiverAddress}
                onChange={handleAddressInputChange}
              />
              <br />
              <input
                id="public-key"
                className="border w-2/3 border-white text-center text-gray-800 py-2 px-4 rounded-lg"
                type="number"
                placeholder="Amount to send"
                name="amount"
                value={amount}
                onChange={handleAmountInputChange}
              />
              <br />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Send SOL
              </button>
            </form>
          </div>
        )}

        <div className="max-w-fit p-5 mx-5 border border-white rounded-md mb-4">
          <p>{`Address: ${publicKey}`}</p>
          <p>{`Balance: ${(balance / LAMPORTS_PER_SOL).toLocaleString(
            "en-US"
          )} SOL`}</p>
        </div>
      </section>
    </div>
  );
}

export default InteractWithWallet;
