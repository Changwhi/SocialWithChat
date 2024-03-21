import Message from "../models/MessageModel.js";
import Conversation from "../models/conversationModel.js";

async function sendMessage(req, res) {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: text,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: text,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: text,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMessages(req, res) {
  const { anotherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, anotherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getConversations(req, res) {
  const userId = req.user._id;

  try {
    const conversation = await Conversation.find({
      participants: { $all: [userId] }, //Filter based on userId
    }).populate({
      //Bring more data based on the userId
      path: "participants",
      select: "username profilePic",
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export { sendMessage, getMessages, getConversations };
