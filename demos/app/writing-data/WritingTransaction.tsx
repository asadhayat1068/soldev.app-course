"use client";
import React, { useEffect, useState } from "react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
const SOL_AMOUNT = 0.00000005;
function WritingTransaction({ secret }: { secret: string }) {
  const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(secret)));
  const connection = new Connection(clusterApiUrl("devnet"));
  const [payerBalance, setPayerBalance] = useState(0);
  const [address, setAddress] = useState("");

  useEffect(() => {
    getPayerInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendPingConnection = async () => {
    const transaction = new Transaction();
    const programId = new PublicKey(PING_PROGRAM_ADDRESS);
    const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);
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
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);
    await getPayerInfo();
    alert(`PING SIGNATURE: ${signature}`);
  };

  const requestAirDrop = async () => {
    try {
      const signature = await connection.requestAirdrop(
        payer.publicKey,
        LAMPORTS_PER_SOL
      );
      alert(`SIGNATURE: ${signature}`);
      await connection.confirmTransaction(signature);
      await getPayerInfo();
    } catch (error: any) {
      alert(`ERROR: ${error.message || "error"}`);
    }
  };

  const getPayerInfo = async () => {
    const info = await connection.getAccountInfo(payer.publicKey);
    setPayerBalance(info?.lamports || 0);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const publicKey = new PublicKey(address);
      const sendSolInstructions = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: publicKey,
        lamports: SOL_AMOUNT * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction().add(sendSolInstructions);
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
      );
      await getPayerInfo();
      alert(`TRANSFER SIGNATURE: ${signature}`);
    } catch (error: any) {
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
      <header className="py-5">
        <p className="text-center text-3xl ">Start Your Solana Journey</p>
        <p className="text-center text-xl ">Writing Data to Blockchain</p>
      </header>
      <section className="content-center">
        <button
          className="mx-2 ml-5 my-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 self-center"
          onClick={sendPingConnection}
        >
          Send Ping Transaction
        </button>

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
              Send {SOL_AMOUNT.toFixed(9)} SOL
            </button>
          </form>
        </div>
        <div className="max-w-fit p-5 mx-5 border border-white rounded-md mb-4">
          <p>{`Payer Address: ${payer.publicKey}`}</p>
          <p>{`Balance: ${(payerBalance / LAMPORTS_PER_SOL).toFixed(
            9
          )} SOL`}</p>
        </div>
        <button
          className="mx-2 ml-5 my-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          onClick={requestAirDrop}
        >
          Request Air Drop
        </button>
      </section>
    </div>
  );
}

export default WritingTransaction;
