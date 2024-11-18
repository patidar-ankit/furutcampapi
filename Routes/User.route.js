import express from 'express';
import UserController from '../Controllers/User.Controller.js';
import MessagesController from '../Controllers/Messages.Controller.js';
const router = express.Router();

// POST /auth/register
router.get('/host-list', UserController.hostList);
router.post('/messages', MessagesController.messages)
router.post('/get-messages', MessagesController.getMessages)
router.post('/get-conv-user-by-host', MessagesController.getConUserByHostId)


export default router;
