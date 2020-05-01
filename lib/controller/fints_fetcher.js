import { getIBAN } from "../generic/bankConv";
import moment from 'moment';
import { BankCommunication } from "../model/bankingCom";
import { Credentials } from "../model/credentials";
import { Document } from "../model/document";
import { Balance } from "../model/balance";


const startDate = moment().subtract(21, "days").toDate()
const endDate = moment().toDate()

class Fetcher {
   constructor() {
      this.creds = undefined
      this.fints = undefined
      this.accounts = []
   }

   getCreds = async () => {
      this.creds = await Credentials.get()
   }

   fetchAndStore = async () => {
      try {
         await this.getCreds()
         for (let i = 0; i< this.creds.length; i++ ) {
            // load up Bank Communication
            this.fints = new BankCommunication(this.creds[i])

            // get all Bankaccounts by this login
            await this.fints.getAccounts()

            for (let i= 0; i < this.fints.accounts.length; i++) {

               // get alle transaction for the selectecd account within time interval
               const statements = await this.fints.getTransactions(this.fints.accounts[i], startDate, endDate);
               const balance = new Balance(statements[0].accountId, statements[0].openingBalance, statements[0].closingBalance)

               // search for balance entry with actual value in DB
               const check = await balance.getValue();
               const result = (check.length === 0  || undefined) ?
                  // no entry found, so create a new row
                  await balance.create() :
                  (check[0].value !== balance.value || check[0].value === undefined) ?
                     // update balance value or do nothing
                     await balance.update() : undefined

               if (result) {
                  // create a set of transactions
                  const docs = statements[0].transactions.map(action => {
                     const doc = new Document(action)
                     doc.setAccount(getIBAN(statements[0].accountId))
                     return doc
                  })

                  // insert new rows of docs
                  await Promise.all(docs.map(async doc => {
                      await doc.create()
                  }))
               }
            }
         }
        } catch (error) {
            console.error(error);
        }
    }

}



export { Fetcher }
