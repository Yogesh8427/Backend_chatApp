const Message = require('../Models/messageSchema');
const { findUser } = require('../utils/aggrigation');

const getUsermessgae = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const { userId, search } = req.query;
    const result= await findUser(userId,search);
    return res.status(200).json({ success: true, result });
  } catch (error) {
 return res.status(404).json({ message: err.message })
  }

}
module.exports = { getUsermessgae, searchUser };