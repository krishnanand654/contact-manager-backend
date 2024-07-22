const Contact = require('../models/Contacts')

exports.createContact = async (req, res) => {

    const user_id = req.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { firstName, lastName, address, company, phoneNumbers } = req.body;


    if (!firstName || !lastName || !address || !company) {

        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newContact = new Contact({
        user_id,
        firstName,
        lastName,
        address,
        company,
        phoneNumbers
    });

    try {
        const saveData = await newContact.save()
        res.status(200).json(saveData)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
exports.viewContactsByUser = async (req, res) => {
    try {
        const user_id = req.user_id;

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit) || 6;
        const startIndex = (page - 1) * limit;

        const sortBy = 'firstName';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }


        const allData = await Contact.find({ user_id: req.user_id })
            .sort({ [sortBy]: sortOrder });

        if (isNaN(page)) {
            return res.status(200).json(allData);
        }

        const paginatedData = allData.slice(startIndex, startIndex + limit);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.viewContactsById = async (req, res) => {
    try {
        const user_id = req.user_id;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const contactId = req.params.id;
        if (!contactId) {
            return res.status(400).json({ message: 'Contact ID must be provided' });
        }
        const contact = await Contact.findOne({ _id: contactId, user_id });

        res.status(200).json(contact)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateContact = async (req, res) => {
    try {

        const user_id = req.user_id;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const contactId = req.params.id;
        if (!contactId) {
            return res.status(400).json({ message: 'Contact ID must be provided' });
        }

        const { firstName, lastName, address, company, phoneNumbers } = req.body;

        if (!firstName || !lastName || !address || !company) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const contact = await Contact.findOne({ _id: contactId, user_id });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or not authorized' });
        }

        await Contact.updateOne({ _id: contactId }, {
            $set: {
                firstName,
                lastName,
                address,
                company,
                phoneNumbers
            }
        });

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};


exports.deleteContacts = async (req, res) => {
    try {

        const user_id = req.user_id;
        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }


        const contactId = req.params.id;
        if (!contactId) {
            return res.status(400).json({ message: 'Contact ID must be provided' });
        }


        const contact = await Contact.findOne({ _id: contactId, user_id });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or not authorized' });
        }


        await Contact.deleteOne({ _id: contactId });
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};
