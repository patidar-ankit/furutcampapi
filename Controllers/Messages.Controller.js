import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import Message from '../Models/Message.model.js';
import User from '../Models/User.model.js';
import mongoose from 'mongoose';
const MessagesController = {
  messages: async (req, res, next) => {
    try {
      const { senderId, receiverId, message } = req.body;
      // const reqBody = req.body
      // const senderId = mongoose.Types.ObjectId(reqBody.senderId);
      // const receiverId = mongoose.Types.ObjectId(reqBody.receiverId);
      const newMessage = new Message({ sender: senderId, receiver: receiverId, message });
      await newMessage.save();
      sendSuccessResponse(res, newMessage, 'message send successfully');
    } catch (error) {
      next(error)
    }
  },

  getMessages: async (req, res, next) => {
    try {
      const { senderId, receiverId } = req.body;
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      }).sort('createdAt').populate('sender', 'username name').populate('receiver', 'username name');
      //   let messages = await Message.find({
      //     $or: [
      //         { sender: senderId, receiver: receiverId },
      //         { sender: receiverId, receiver: senderId }
      //     ]
      // }).sort('timestamp');

      // console.log("Messages without population:", messages);

      // messages = await Message.populate(messages, [
      //     { path: 'sender', select: 'username email' },
      //     { path: 'receiver', select: 'username email' }
      // ]);

      // console.log("Messages with population:", messages)

      sendSuccessResponse(res, messages, 'messages fetched successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  getConUserByHostId: async (req, res, next) => {
    try {
      const { hostId } = req.body;
      const messages = await Message.find({
        $or: [
          { sender: hostId },
          { receiver: hostId }
        ]
      })
        .sort('createdAt') // Sort in descending order to get the latest message
        .populate('sender', 'username name')
        .populate('receiver', 'username name');

      const users = []
      for (let i of messages) {
        const sId = i.sender._id.toString()
        const rId = i.receiver._id.toString()
        if (sId !== hostId) {
          users.push(sId)
        }
        if (rId !== hostId) {
          users.push(rId)
        }
      }
      let uniqueUsers = [...new Set(users)];

      let msg = []
      for(let item of uniqueUsers){
        const lastMessage = await Message.find({
          $or: [
            { sender: item },
            { receiver: item }
          ]
        })
        .sort({ createdAt: -1 }) // Sort in descending order to get the latest message
        .limit(1)                 // Limit to one result (the last one)
        .populate('sender', 'username name')
        .populate('receiver', 'username name');
        const user = await User.findById(item)
        const obj ={
          _id: lastMessage[0]._id,
          userId: item,
          name: user.name,
          profilePhoto: user.profilePhoto,
          messages: lastMessage[0].message,
          createdAt: lastMessage[0].createdAt
        }
        msg.push(obj)
      }
     

      sendSuccessResponse(res, msg, 'messages fetched successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  }
}


export default MessagesController;


