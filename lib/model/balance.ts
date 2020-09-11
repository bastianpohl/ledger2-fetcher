import { DatabaseManager } from "./db";
import { getIBAN } from "../generic/bankConv";

const dbm = new DatabaseManager()

class Balance {
   iban: string;
   date: any;
   value: number;
   openingBalance: any;
   closingBalance: any;

   constructor(account: any, openingBalance: any, closingBalance: any) {
      this.iban = getIBAN(account)
      this.date = closingBalance.date
      this.value = (closingBalance.isCredit) ? closingBalance.value : closingBalance.value * -1
      this.openingBalance = (openingBalance.isCredit) ? openingBalance.value : openingBalance.value * -1
      this.closingBalance = (closingBalance.isCredit) ? closingBalance.value : closingBalance.value * -1
   }

   async create() {
      let sql = `
      INSERT INTO balances SET ?
    `
      return await dbm.query(sql, this)
   }

   async getValue() {
      let sql = `
      SELECT value FROM balances WHERE date = '${this.date}' AND iban = '${this.iban}'
    `
      return await dbm.query(sql, null)
   }

   async update() {
      let sql = `
      UPDATE balances SET value = '${this.value}' WHERE date = '${this.date}' AND iban = '${this.iban}'
    `
      return await dbm.query(sql, null)
   }
}

export { Balance }