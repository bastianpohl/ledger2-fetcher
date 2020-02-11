import IBAN from "iban";
import { BankCommunication } from "../model/banking";
import { DatabaseManager } from "../model/db";

// if (isLinux === true) {
//   import { Journald } from "systemd-journald";
//   var log = new Journald({syslog_identifier: 'fints-fetcher'})
// }

const bank = {
    url: process.env.FINTS_HOST,
    name: process.env.FINTS_ACCOUNT,
    pin: process.env.FINTS_PIN,
    blz: process.env.FINTS_BLZ
}
const startDate = new Date()
const endDate = new Date();


const dbm = new DatabaseManager()
const fints = new BankCommunication()

class Fetcher {
    static fetchAndStore = async () => {
        try {
            await fints.init(bank.name, bank.blz, bank.pin, bank.url)
            await fints.getAccounts()
            for (let i = 0; i < fints.accounts.length; i++) {

                let statements = await fints.getTransactions(fints.accounts[i], startDate, endDate)
                let balance = new Balance(statements[0].accountId, statements[0].openingBalance, statements[0].closingBalance)
                let check = await balance.getValue()
                let result = undefined

                if (check.length === 0) {
                    result = await balance.create()
                    if (isLinux) {
                      log.notice ("new balance", 
                      { 
                        "date": balance.date,
                        "iban:": balance.iban,
                        "value": balance.value
                      })
                    }
                } else {
                    result = (check[0].value !== balance.value || check[0].value === undefined) ? await balance.update() : undefined
                }

                if (result) { // write transactions to the db
                    let docs = statements[0].transactions.map(action => new Document(
                      undefined, 
                      action.id, 
                      action.descriptionStructured.name, 
                      action.descriptionStructured.text, 
                      action.valueDate, 
                      action.entryDate, 
                      action.descriptionStructured.iban, 
                      action.isCredit, 
                      action.amount, 
                      action.description, 
                      0, 
                      getIBAN(statements[0].accountId)))

                    await Promise.all(docs.map(async doc => {
                      let result = await doc.create()
                      console.log(result);
                    }))
                    
                }
            }
        } catch (error) {
            console.error(error);

        }
    }
}

class Document {

    constructor(id, bank_id, name, type, valueDate, entryDate, iban, isCredit, amount, description, category, account) {
        this.id = (id) ? id : undefined
        this.bank_id = bank_id
        this.name = name
        this.type = type.replace("Ã", "Ü")
        this.valueDate = valueDate
        this.entryDate = entryDate
        this.iban = (iban) ? iban : null
        this.amount = (isCredit === false) ? Number(-1 * amount) : amount
        this.description = description
        this.category = category
        this.account = account
    }

    checkHash = async () => {
      let docAsString = JSON.stringify(this)
      let sql = `
        SELECT 
          COUNT(id) as count
        FROM
          transactions
        WHERE
          hash = MD5('${docAsString}')
        LIMIT 1
      `
      return await dbm.query(sql)
    }

    create = async () => {
        let sql = `
          INSERT INTO 
            transactions
            (
              bank_id, 
              name, 
              type, 
              valueDate, 
              entryDate, 
              iban, 
              amount, 
              description, 
              category, 
              account
            )
          VALUES 
            ( 
              '${this.bank_id}',
              '${this.name}',
              '${this.type}',
              '${this.valueDate}',
              '${this.entryDate}',
              '${this.iban}',
              '${this.amount}',
              '${this.description}',
              '${this.category}',
              (SELECT id FROM accounts WHERE iban = '${this.account}')
            )
         ` 
         return await dbm.query(sql)
    }
}

const getBankAccount = (accountId) => {
    let acc = accountId.split("/")
    let bank = acc[0]
    let account = acc[1]
    return {bank, account}
}

const getBBAN = (data) => {
  let obj = getBankAccount(data)
  return `${obj.bank}${obj.account}`
};

const getIBAN = (data) => {
  let bban = getBBAN(data)
  return IBAN.fromBBAN(`DE`, bban)
};

class Balance {
  constructor(account, openingBalance, closingBalance) {
    this.iban = getIBAN(account)
    this.date = closingBalance.date
    this.value = (closingBalance.isCredit) ? closingBalance.value : closingBalance * -1
    this.openingBalance = JSON.stringify(openingBalance)
    this.closingBalance = JSON.stringify(closingBalance)
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

const isLinux = () =>{
  return (process.platform === "linux") ? true : false;
}



export { Fetcher }
