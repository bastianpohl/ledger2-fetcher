// ESM syntax is supported.
// integrate .env files
import * as dotenv from "dotenv";

dotenv.config()

// import local functions
import { Fetcher } from "./lib/controller/fints_fetcher";


const fetch = async () => {
  await Fetcher.fetchAndStore()
}

fetch()