const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
import { Client, Account, TablesDB, Query, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);
export const updateSearchCount = async (searchTerm, movie) => {
  // to check if the searchTerm has been searched before
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });
    if (result.rows.length > 0) {
      // if it does, update count
      const row = result.rows[0];
      await tablesDB.updateRow(DATABASE_ID, TABLE_ID, row.$id, {
        count: row.count + 1,
      });
    } else {
      // if it doesn't create a new document with the searchTerm and count as 1
      await tablesDB.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const getTrendingMovies = async () => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
