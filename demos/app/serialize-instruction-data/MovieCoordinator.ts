import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { Movie } from "./Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";
export class MovieCoordinator {
  static accounts: PublicKey[] = [];

  static async prefetchAccounts(connection: Connection, search: string = "") {
    const accounts = await connection.getProgramAccounts(
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: {
          offset: 2,
          length: 18,
        },
        filters:
          search == ""
            ? []
            : [
                {
                  memcmp: {
                    offset: 6,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
      }
    );
    this.accounts = accounts
      .toSorted((a, b) => {
        const lengthA = a.account.data.readUint32LE(0);
        const lengthB = b.account.data.readUint32LE(0);
        const dataA = a.account.data.slice(4, 4 + lengthA).toString();
        const dataB = b.account.data.slice(4, 4 + lengthB).toString();
        return dataA.localeCompare(dataB);
      })
      .map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: Connection,
    page: number,
    itemsPerPage: number,
    search: string = "",
    reload: boolean = false
  ): Promise<Movie[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts =
      await connection.getMultipleAccountsInfo(paginatedPublicKeys);
    const movies = accounts.reduce((_movies: Movie[], account) => {
      const movie = Movie.deserialize(account?.data);
      if (!movie) {
        return _movies;
      }
      return [..._movies, movie];
    }, []);
    return movies;
  }
}
