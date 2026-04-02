import Chat from '../models/Chat.model.js';
import Item from '../models/Item.model.js';

export const initiateChat = async (req, res) => {
  try {
    const { lostItemId, foundItemId, loserId, finderId, matchScore } = req.body;
    
    if (!lostItemId || !foundItemId || !loserId || !finderId) {
      return res.status(400).json({ success: false, message: 'Missing required fields for chat initiation' });
    }

    // 1. Check if chat already exists
    const existingChat = await Chat.findOne({ lostItemId, foundItemId }).populate('participants', 'name email');

    if (existingChat) {
      return res.status(200).json({ success: true, chat: existingChat });
    }

    // 2. Create New Chat
    const newChat = await new Chat({ 
      lostItemId, 
      foundItemId, 
      participants: [loserId, finderId], 
      matchScore, 
      status: 'active' 
    }).save();

    // 3. Update related items
    await Item.findByIdAndUpdate(lostItemId, { status: 'matched' });
    await Item.findByIdAndUpdate(foundItemId, { status: 'matched' });

    // 4. Populate participants
    await newChat.populate('participants', 'name email');

    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    console.error('Error in initiateChat controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // 1. Fetch Chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // 2. Verify Ownership / Participation
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied: not a participant' });
    }

    // 3. Sort messages by sentAt
    const sortedMessages = chat.messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

    res.status(200).json({ success: true, messages: sortedMessages });
  } catch (error) {
    console.error('Error in getMessages controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    // 1. Fetch Chat
    const chat = await Chat.findById(chatId);

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    // 2. Verify Participation
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied: not a participant' });
    }
    
    // 3. Ensure Chat is active
    if (chat.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Chat is closed' });
    }

    // 4. Append message
    chat.messages.push({
      senderId: userId,
      text: text.trim()
    });

    // 5. Save to DB
    await chat.save();
    
    // Return the newly added message (last in array)
    const savedMessage = chat.messages[chat.messages.length - 1];
    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error in sendMessage controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const closeChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // 1. Fetch Chat
    const chat = await Chat.findById(chatId);

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    // 2. Verify Participation
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied: not a participant' });
    }

    // 3. Mark chat as closed
    chat.status = 'closed';
    chat.closedAt = new Date();
    await chat.save();

    // 4. Update both linked items
    await Item.findByIdAndUpdate(chat.lostItemId, { status: 'resolved' });
    await Item.findByIdAndUpdate(chat.foundItemId, { status: 'resolved' });

    res.status(200).json({ success: true, message: 'Chat closed, item marked as returned' });
  } catch (error) {
    console.error('Error in closeChat controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({
      participants: userId
    }).populate('participants', 'name email').populate('lostItemId foundItemId', 'title category location');
    
    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error('Error in getUserChats controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
