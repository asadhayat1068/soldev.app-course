"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
function PingWithApproval() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();

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
      const transaction = new Transaction();
      const programId = new PublicKey(PING_PROGRAM_ADDRESS);
      const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);
      const senderPublicKey = new PublicKey(publicKey ?? "");
      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId,
      });
      transaction.add(instruction);
      const signature = await sendTransaction(transaction, connection);
      alert(`PING SIGNATURE: ${signature}`);
    } catch (error: any) {
      alert(error.message);
    }
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
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center min-w-full items-center"
            >
              <button
                type="submit"
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Send PING Transaction
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export default PingWithApproval;
