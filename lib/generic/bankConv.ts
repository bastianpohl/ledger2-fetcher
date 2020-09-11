import IBAN from 'iban'

export const getBankAccount = (accountId: string) => {
   let acc = accountId.split("/")
   let bank = acc[0]
   let account = acc[1]
   return {bank, account}
}

export const getBBAN = (data: string): string => {
 let obj = getBankAccount(data)
 return `${obj.bank}${obj.account}`
};

export const getIBAN = (data: string): string => {
 let bban = getBBAN(data)
 return IBAN.fromBBAN(`DE`, bban)
};

