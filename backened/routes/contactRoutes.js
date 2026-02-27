import express from 'express'
import { submitContact, getAllContacts, markAsRead } from '../controllers/contactController.js'
import authAdmin from '../middlewares/authAdmin.js'

const contactRouter = express.Router()


contactRouter.post('/submit', submitContact)


contactRouter.get('/all', authAdmin, getAllContacts)
contactRouter.post('/mark-read', authAdmin, markAsRead)

export default contactRouter
