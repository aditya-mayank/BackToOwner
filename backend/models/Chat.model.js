import mongoose from 'mongoose';

// Message sub-schema (embedded in Chat)
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: false
  },
  attachmentUrl: {
    type: String
  },
  attachmentType: {
    type: String,
    enum: ['image', 'video']
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

// Main Chat schema
const chatSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    participants: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      validate: [
        (val) => val.length === 2,
        'A chat must have exactly 2 participants.'
      ]
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    },
    matchScore: {
      type: Number
    },
    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index on participants field to easily query chats that a user is part of
chatSchema.index({ participants: 1 });

// Unique compound index on [lostItemId, foundItemId] to prevent duplicate chats
chatSchema.index({ lostItemId: 1, foundItemId: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
