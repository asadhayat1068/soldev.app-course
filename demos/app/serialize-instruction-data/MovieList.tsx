"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Movie } from "./Movie";

function MovieList({ ProgramId }: { ProgramId: string }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  useEffect(() => {
    getReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection]);

  const getReviews = async () => {
    const accounts = await connection.getProgramAccounts(
      new PublicKey(ProgramId)
    );
    const _movies: (Movie | null)[] = accounts.map(({ account }) => {
      return Movie.deserialize(account.data);
    });
    setMovies(_movies);
    console.log(_movies);
  };

  return (
    <div className="min-w-lg border border-white mb-5 pb-3">
      <header className="text-3xl py-5">
        <p className="text-center">Movie Reviews</p>
      </header>
      <section className="flex flex-col">
        {movies.map((movie, i) => (
          <div
            className="text-center m-1 py-2 border border-b-1 border-b-white"
            key={i}
          >
            <h1 className="text-2xl">{movie?.title}</h1>
            <span className="m-1 mb-3 p-1 rounded bg-sky-950 text-white">
              {movie?.rating}
            </span>
            <p className="my-2">{movie?.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default MovieList;
