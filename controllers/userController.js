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