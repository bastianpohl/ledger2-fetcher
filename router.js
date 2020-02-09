// initiate router
import express from "express";
const router = express.Router()

// import controller for routes
import { DocumentsController } from "./lib/controller/documents.js";

const checkAuth = (next) => {
  next()
}
 

router.get('/documents/:iban', DocumentsController.index)

router.get('/', (req, res) => {
  res.sendStatus(200)
})


export default router