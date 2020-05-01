// ESM syntax is supported.

// integrate env files
import * as dotenv from "dotenv";
dotenv.config()

// import local functions
import { Fetcher } from "./lib/controller/fints_fetcher";

// fetch transactions and store to sql db
const fetch = async () => {
   const fetcher = new Fetcher()
   await fetcher.fetchAndStore()
   process.exit()
}

// run
fetch()