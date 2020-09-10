import { DatabaseManager } from "./db";

const dbm = new DatabaseManager()

class Modify {
   
   constructor(doc) {
      this.doc
      this.sets = []
   }

   item = async () => {
      this.sets = await this.getSets()
      this.sets.map (async set => {
         var validation = false

         const filters = await Modify_Filter.get(set.id)
         const filterFunc = (set.operator === "AND") ? "every" : "some"
         validation = filters[filterFunc](filter => 
            this.doc[filter.field].includes(filter.value)
            )
         
         if (!validation) {
            return
         }

         this.callMethod(set.id)
         return doc
      })
   }

   callMethod = async (id) => {
      const action = await Modify_Actions.index(id)
      return action[0].method(action[0].newValue)
   }

   getSets = async() => {
      const sql = `
         SELECT 
            id as id,
            title as title
            filter_operator as operator
         FROM
            modifty_set
      `
      return await dbm.query(sql, null)
   }

   updateCategory = (newValue) => {
      this.doc.category = newValue
   }

   updateTax = (newValue) => {
      this.doc.tax = newValue
   }

   updatePeriod = (modifier) => {
      this.doc.period = this.doc.period + modifier
   }

}

class Modify_Filter {
   get = async (id) => {
      const sql = ` 
         SELECT 
            field,
            value
         FROM 
            modify_filter
         WHERE 
            set_id = ?
      `
      return await dbm.query(sql, [id])
   }   
}

class Modify_Actions {
   index = async (id) => {
      const sql = `
         SELECT 
            method,
            new_value,
         FROM 
            modify_actions
         WHERE
            set_id = ?
      `
      return await dbm.query(
         sql,
         [id]
      )
   }

}

export { Modify }