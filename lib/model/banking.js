import { PinTanClient } from "fints";

class BankCommunication {
  constructor() {
    this.client = {}
    this.accounts = []
  }

  init = async (account, blz, pin, url) => {
    this.client = new PinTanClient({
      url: url,
      name: account,
      pin: pin,
      blz: blz,
    })
  }

  getAccounts = async () => {
    this.accounts = await this.client.accounts()
  }

  getTransactions = async(account, date_from, date_to) => {
    return await this.client.statements(account, date_from, date_to)
  }
}

export { BankCommunication }