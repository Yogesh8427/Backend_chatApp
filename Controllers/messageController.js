const Message = require('../Models/messageSchema');
const { findUser, getRecentChats } = require('../utils/aggrigation');

const getUserMessage = async (req, res) => {
  try {
    const { roomId, page = 1, limit = 20 } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const totalMessages = await Message.countDocuments({ roomId });

    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize);
    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalMessages / pageSize),
      totalMessages,
      messages
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const searchUser = async (req, res) => {
  try {
    const { userId, search } = req.query;
    const result = await findUser(userId, search);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(404).json({ message: err.message })
  }

}

const getMyChats = async (req, res, next) => {
  try {
    const { userId, pageNo } = req.query;;
    const allChats = await getRecentChats(userId, pageNo);
    return res.status(200).json({ message: "user get succesfully", allChats })
  }
  catch (err) {
    return res.status(404).json({ message: err.message })
  }
}

module.exports = { getUserMessage, searchUser, getMyChats };