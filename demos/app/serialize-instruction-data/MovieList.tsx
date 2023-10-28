"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Movie } from "./Movie";

function MovieList({ ProgramId }: { ProgramId: string }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const itemsPerPage = 10;
  useEffect(() => {
    getReviews(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection]);

  const getReviews = async (pageNumber: number) => {
    const accounts = await connection.getProgramAccounts(
      new PublicKey(ProgramId),
      {
        dataSlice: {
          offset: 0,
          length: 0,
        },
      }
    );
    const accountKeys = accounts.map(({ pubkey }) => pubkey);
    setMaxPage(Math.ceil(accountKeys.length / itemsPerPage));
    const startIndex = pageNumber * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedKeys = accountKeys.slice(startIndex, endIndex);
    const moviesData = await connection.getMultipleAccountsInfo(paginatedKeys);
    const _movies: (Movie | null)[] = moviesData.map((account) => {
      return Movie.deserialize(account?.data);
    });
    setMovies(_movies);
  };
  const nextPage = () => {
    if (page < maxPage) {
      setPage(page + 1);
      getReviews(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      getReviews(page - 1);
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
          <span> &nbsp;&nbsp; {page + 1} &nbsp;&nbsp;</span>
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
