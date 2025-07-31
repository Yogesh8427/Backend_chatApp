const Message = require('../Models/messageSchema');

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

module.exports = { getUsermessgae };