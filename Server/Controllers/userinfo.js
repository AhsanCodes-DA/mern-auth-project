import userModel from "../models/userModels.js";

const userInfo = async(req, res, next) => {
    const { userId } = req.body;
    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default userInfo;