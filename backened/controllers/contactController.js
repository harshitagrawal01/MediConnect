import Contact from '../models/contactModel.js'

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.json({ success: false, message: 'Name, email and message are required' })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: 'Please enter a valid email address' })
    }

    // Save to MongoDB
    const contact = new Contact({ name, email, phone, message })
    await contact.save()

    res.json({ success: true, message: 'Message sent successfully! We will get back to you soon.' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get all contact messages (admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, contacts })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Mark message as read (admin only)
const markAsRead = async (req, res) => {
  try {
    const { contactId } = req.body
    await Contact.findByIdAndUpdate(contactId, { status: 'read' })
    res.json({ success: true, message: 'Marked as read' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { submitContact, getAllContacts, markAsRead }
