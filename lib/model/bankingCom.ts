import { PinTanClient, SEPAAccount } from "fints";
import Cryptr  from "cryptr";

const secret = process.env.SECRET || "a"
const cryptr = new Cryptr(secret)

class BankCommunication {
   client: PinTanClient;
   accounts: SEPAAccount[];

   constructor(data: any) {
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

   getTransactions = async (account: SEPAAccount, date_from: Date, date_to: Date) => {
     try {
        return await this.client.statements(account, date_from, date_to)
     } catch (error) {
        throw error
     }
   }
}

export { BankCommunication }