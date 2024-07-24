const User = require("../models/User")

exports.getUser = async (req, res) => {
    const user_id = req.user_id;
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const user = await User.findOne({ _id: user_id }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const { refreshToken, password, ...userData } = user;

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user_id = req.user_id;
        const updateData = req.body;
        if (req.file) {

            updateData.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        delete updateData._id;

        const updatedUser = await User.updateOne({ _id: user_id }, updateData
        );


        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ message: 'Email already exists' });
        } else if (error.code === 11000 && error.keyPattern.phoneNumber) {
            res.status(400).json({ message: 'Phone number already exists' });
        } else {
            res.status(400).json({ message: 'Error updating user', error });
        }
    }
};
