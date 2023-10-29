"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Movie } from "./Movie";
import { MovieCoordinator } from "./MovieCoordinator";

const ITEMS_PER_PAGE = 10;

function MovieList() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    MovieCoordinator.fetchPage(connection, page, ITEMS_PER_PAGE).then(
      setMovies
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection, page]);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="min-w-lg border border-white mb-5 pb-3">
      <header className="text-3xl py-5">
        <p className="text-center">Movie Reviews</p>
      </header>
      <section className="flex flex-col">
        <div className="text-center my-4">
          <button onClick={prevPage}> &lt; Prev </button>
          <span> &nbsp;&nbsp; {page} &nbsp;&nbsp;</span>
          <button onClick={nextPage}> Next &gt; </button>
        </div>
      </section>
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
