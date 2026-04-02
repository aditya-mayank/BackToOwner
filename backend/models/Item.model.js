import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Electronics', 'Stationery', 'Clothing', 'Accessories', 'ID Card', 'Keys', 'Books', 'Other'],
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'matched', 'resolved', 'archived'],
      default: 'active'
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateLost: {
      type: Date,
      default: null
    },
    archivedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index on [type, status, category] for efficient search queries
itemSchema.index({ type: 1, status: 1, category: 1 });

// Text index on [title, description] for keyword search
itemSchema.index({ title: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
