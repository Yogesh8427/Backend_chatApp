const Message = require('../Models/messageSchema');
const userModel = require('../Models/userSchema');
const getRecentChats = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const result = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { receiver: userId }]
            }
        },
        { $sort: { timestamp: -1 } },
        {
            $group: {
                _id: "$roomId",
                lastMessage: { $first: "$message" },
                sender: { $first: "$sender" },
                receiver: { $first: "$receiver" },
                timestamp: { $first: "$timestamp" },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$receiver", userId] },
                                    { $eq: ["$isRead", false] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
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
        { $unwind: "$userDetails" },
        {
            $project: {
                roomId: "$_id",
                lastMessage: 1,
                timestamp: 1,
                unreadCount: 1,
                user: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email"
                }
            }
        },
        { $sort: { timestamp: -1 } },
        {
            $facet: {
                metadata: [{ $count: "total" }],  // total count of rooms
                data: [{ $skip: skip }, { $limit: limit }] // paginated data
            }
        }
    ]);

    return {
        total: result[0].metadata[0]?.total || 0,
        totalPages: Math.ceil((result[0].metadata[0]?.total || 0) / limit),
        chats: result[0].data
    };
};

const findUser = async (userId, search) => {
    // Step 1: Find all users matching the search
    const matchingUsers = await userModel.find({
        name: { $regex: search, $options: 'i' },
    });

    // Step 2: Get all recent chats
    const recentChats = await getRecentChats(userId);

    // Step 3: Filter recent chats to include only those matching the search
    const filteredRecentChats = recentChats?.chats?.filter(chat =>
        chat.user.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Step 4: Add matched users who are not in filteredRecentChats
    const recentUserIds = filteredRecentChats.map(chat => chat.user._id.toString());
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

    return [...filteredRecentChats, ...remainingUsers];
};
module.exports = { getRecentChats, findUser };