// ESM syntax is supported.

import { DatabaseManager } from './lib/model/db'

// integrate env files
import * as dotenv from "dotenv";
dotenv.config()

const dbm = new DatabaseManager()

const select = async () => {
   const sql = `
      SELECT * from balances
   `
   return  await dbm.query(sql, undefined)
}

const update = async (id, newOpening, newClosing) => {
   const sql = `
      UPDATE
         balances
      SET 
         openingBalance = '${newOpening}', 
         closingBalance = '${newClosing}'
      WHERE
         id = '${id}'
   `
   const result = await dbm.query(sql, undefined)
   console.log(result);
}

const migration = async () => {

   const balances = await select()
   await Promise.all(balances.map(balance => {
      let openingBalance = JSON.parse(balance.openingBalance)
      let closingBalance = JSON.parse(balance.closingBalance)
      
      let newOpening = (openingBalance.isCredit) ? openingBalance.value : openingBalance.value * -1
      let newClosing = (closingBalance.isCredit) ? closingBalance.value : closingBalance.value * -1
      
      update(balance.id, newOpening, newClosing)
   }))
   process.exit
}

migration()