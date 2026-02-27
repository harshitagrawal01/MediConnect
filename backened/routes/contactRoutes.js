import express from 'express'
import { submitContact, getAllContacts, markAsRead } from '../controllers/contactController.js'
import authAdmin from '../middlewares/authAdmin.js'

const contactRouter = express.Router()

// Public route — anyone can submit
contactRouter.post('/submit', submitContact)

// Admin only routes
contactRouter.get('/all', authAdmin, getAllContacts)
contactRouter.post('/mark-read', authAdmin, markAsRead)

export default contactRouter
