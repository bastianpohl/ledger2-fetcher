import sqldb from "mysql2/promise";

const conf = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
}



class DatabaseManager {
  constructor() {
    this.conn = null
  }

  initDB = async () => {
    try {
      this.conn = await sqldb.createPool(conf)  
    } catch (error) {
      console.error(error);
      
    }
    
  }

  read = async () => {
  }

  query = async (sql, values) => {
    try {
      if (this.conn === null) {
        await this.initDB()
      }
      const [result, field] = await this.conn.query(sql, values)
      return result
    } catch (error) {
      return error
    }
  }

  checkAndinsert = async (table, data) => {  
    await this.initDB()
    
  }

  close = async () => {
    await this.conn.closeC
  }
}

export { DatabaseManager}