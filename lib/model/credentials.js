import { DatabaseManager } from "./db";

const dbm = new DatabaseManager()

class Credentials {
   static get = async () => {
      try {
         const sql = `
            SELECT
               id, login, pin, blz, fintsUrl as url
            FROM
               fints_credentials
         `
         return await dbm.query(sql, null)
      } catch (error) {
         throw error
      }
   }
}

export { Credentials }