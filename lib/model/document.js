import { DatabaseManager } from "./db";

const dbm = new DatabaseManager()

class Document {

   constructor(data) {
      this.id = (!data.bank_id) ? undefined : data.id
      this.bank_id = (!data.bank_id) ? data.id : data.bank_id
      this.name = data.descriptionStructured.name
      this.type = data.descriptionStructured.text.replace("Ã", "Ü")
      this.valueDate = data.valueDate
      this.entryDate = data.entryDate
      this.iban = (data.iban) ? (data.iban) : null
      this.amount = (data.isCredit === false) ? Number(-1 * data.amount) : data.amount
      this.description = data.descriptionStructured.reference.text
      this.category = 0
      this.account = 0
   }

   setAccount = (account) => {
      this.account = account
   }

   setCategory = (category) => {
     this.category = category
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
              '(SELECT IF(${this.category} <> 0, (SELECT id FROM categories where title = '${this.category}' AND account = '${this.account}'
                ),0))',
              (SELECT id FROM accounts WHERE iban = '${this.account}')
            )
         `
      return await dbm.query(sql)
   }
}

export { Document }