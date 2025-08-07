const Message = require('../Models/messageSchema');
const userModel = require('../Models/userSchema');
const getRecentChats = async (userId) => {
    const recentChats = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            }
        },
        {
            $sort: { timestamp: -1 }
        },
        {
            $group: {
                _id: "$roomId",
                lastMessage: { $first: "$message" },
                sender: { $first: "$sender" },
                receiver: { $first: "$receiver" },
                timestamp: { $first: "$timestamp" }
            }
        },
        {
            $addFields: {
                otherUserId: {
                    $cond: [
                        { $eq: ["$sender", userId] },
                        "$receiver",
                        "$sender"
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "users",
                let: { otherId: "$otherUserId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", { $toObjectId: "$$otherId" }]
                            }
                        }
                    }
                ],
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                roomId: "$_id",
                lastMessage: 1,
                timestamp: 1,
                user: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email"
                }
            }
        },
        {
            $sort: { timestamp: -1 }
        }
    ]);

    return recentChats;
};
const findUser = async (userId, search) => {
    // Step 1: Find all users matching the search
    const matchingUsers = await userModel.find({
        name: { $regex: search, $options: 'i' },
    });

    // Step 2: Aggregate messages involving userId
    const recentChats = await getRecentChats(userId);

    // Step 3: Include matched users who don't have any chat yet
    const recentUserIds = recentChats.map(chat => chat.user._id.toString());
    const remainingUsers = matchingUsers
        .filter(u => !recentUserIds.includes(u._id.toString()))
        .map(u => ({
            roomId: [userId, u._id.toString()].sort().join('_'),
            lastMessage: null,
            timestamp: null,
            user: {
                _id: u._id,
                name: u.name,
                email: u.email
            }
        }));

    return [...recentChats, ...remainingUsers];
};
module.exports = { getRecentChats, findUser };