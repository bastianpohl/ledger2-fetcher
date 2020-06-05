import { PinTanClient } from "fints";
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.SECRET)

class BankCommunication {
   constructor(data) {
     this.client = new PinTanClient({
      url: data.url,
      name: cryptr.decrypt(data.login),
      pin: cryptr.decrypt(data.pin),
      blz: data.blz,
      })
      this.accounts = []
   }

   getAccounts = async () => {
      try {
         this.accounts = await this.client.accounts()
      } catch (error) {
         console.error(error)
      }
   }

   getTransactions = async (account, date_from, date_to) => {
     try {
        return await this.client.statements(account, date_from, date_to)
     } catch (error) {
        throw error
     }
   }
}

export { BankCommunication }