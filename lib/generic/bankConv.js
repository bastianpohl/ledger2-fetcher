import IBAN from 'iban'

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

export { getBankAccount, getBBAN, getIBAN }