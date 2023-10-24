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
import { Movie } from "./Movie";
import MovieList from "./MovieList";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

function MovieReviewApp() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

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
    const movie = new Movie(title, rating, review);
    handleTransactionSubmit(movie);
    try {
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      alert("Connect Wallet");
      return;
    }
    const buffer = movie.serialize();
    const transaction = new Transaction();
    const [pda] = await PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(movie.title)],
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

    const instructions = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });
    transaction.add(instructions);
    try {
      let txid = await sendTransaction(transaction, connection);
      console.log("Transaction Submitted: ", txid);
    } catch (error: any) {
      console.log("Transaction Error: ", error);
    }
  };

  const handleMovieTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
  };

  const handleReviewInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleMovieRatingInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRating(parseInt(event.target.value));
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
            <h1 className="text-2xl text-center mb-3">Review a Movie</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center min-w-full items-center"
            >
              <input
                id="movie-title"
                className="border w-2/3 border-white text-center text-gray-800 py-2 px-4 rounded-lg"
                type="text"
                placeholder="Movie Title"
                required
                name="movieTitle"
                value={title}
                onChange={handleMovieTitleInputChange}
              />
              <br />
              <textarea
                id="Review"
                className="border w-2/3 border-white text-center text-gray-800 py-2 px-4 rounded-lg"
                placeholder="Write Review here.."
                name="review"
                required
                value={review}
                onChange={handleReviewInputChange}
              ></textarea>
              <br />
              <input
                id="rating"
                className="border w-2/3 border-white text-center text-gray-800 py-2 px-4 rounded-lg"
                type="number"
                placeholder="Rating"
                required
                name="movieRating"
                value={rating}
                onChange={handleMovieRatingInputChange}
              />
              <br />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        <section className="content-center">
          <MovieList ProgramId={MOVIE_REVIEW_PROGRAM_ID} />
        </section>

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

export default MovieReviewApp;
