import cron from 'node-cron';
import Item from '../models/Item.model.js';
import Chat from '../models/Chat.model.js';

export const runArchivalNow = async () => {
  try {
    const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    
    const result = await Item.updateMany(
      { status: 'active', createdAt: { $lt: cutoff } },
      { $set: { status: 'archived', archivedAt: new Date() } }
    );
    
    console.log('[Archival Job] Archived items:', result.modifiedCount);

    // Close stale chats where both linked items are now archived
    const activeChats = await Chat.find({ status: 'active' }).populate('lostItemId foundItemId');
    
    let closedChatsCount = 0;
    for (const chat of activeChats) {
      const lostArchived = chat.lostItemId && chat.lostItemId.status === 'archived';
      const foundArchived = chat.foundItemId && chat.foundItemId.status === 'archived';

      if (lostArchived && foundArchived) {
        chat.status = 'closed';
        chat.closedAt = new Date();
        await chat.save();
        closedChatsCount++;
      }
    }
    
    if (closedChatsCount > 0) {
      console.log(`[Archival Job] Closed stale chats: ${closedChatsCount}`);
    }

    return result.modifiedCount;
  } catch (error) {
    console.error('[Archival Job] Error:', error.message);
    // Do not throw the error to prevent any possibility of crashing the server instance
  }
};

export const startArchivalJob = () => {
  // Run once every day at midnight server-time ('0 0 * * *')
  cron.schedule('0 0 * * *', async () => {
    console.log('[Archival Job] Running scheduled auto-archival process...');
    try {
      await runArchivalNow();
    } catch (e) {
      console.error('[Archival Job] Schedule execution failed.', e);
    }
  });

  console.log('[Archival Job] Scheduled to run at midnight daily.');
};
