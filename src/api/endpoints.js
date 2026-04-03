import axiosClient from './axiosClient.js';

// --- Auth Endpoints --- 
export const authAPI = {
  register: async (data) => {
    try {
      const response = await axiosClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// --- Item Endpoints ---
export const itemsAPI = {
  reportFound: async (formData) => {
    try {
      // Must override default Content-Type for multer / form data support
      const response = await axiosClient.post('/items/found', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  reportLost: async (formData) => {
    try {
      const response = await axiosClient.post('/items/lost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchItems: async (params) => {
    try {
      const response = await axiosClient.get('/items/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getItemById: async (id) => {
    try {
      const response = await axiosClient.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editItem: async (id, formData) => {
    try {
      const response = await axiosClient.put(`/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// --- User Endpoints ---
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// --- Chat Endpoints ---
export const chatAPI = {
  getUserChats: async () => {
    try {
      const response = await axiosClient.get('/chat');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMessages: async (chatId) => {
    try {
      const response = await axiosClient.get(`/chat/${chatId}/messages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  sendMessage: async (chatId, text) => {
    try {
      const response = await axiosClient.post(`/chat/${chatId}/messages`, { text });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  closeChat: async (chatId) => {
    try {
      const response = await axiosClient.put(`/chat/${chatId}/close`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// --- Admin Endpoints ---
export const adminAPI = {
  getStats: async () => {
    try {
      const response = await axiosClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllItems: async (params) => {
    try {
      const response = await axiosClient.get('/admin/items', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  blockUser: async (userId, targetStatus) => {
    try {
      const response = await axiosClient.put(`/admin/users/${userId}/block`, { status: targetStatus });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  archiveItem: async (itemId, action = 'archive') => {
    try {
      // action will be sent as ?action=delete/archive
      const response = await axiosClient.delete(`/admin/items/${itemId}`, { params: { action } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// --- Notification Endpoints ---
export const notificationAPI = {
  getMy: async () => {
    try {
      const response = await axiosClient.get('/notifications/my');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  markRead: async (id) => {
    try {
      const response = await axiosClient.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
