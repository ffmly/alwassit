// --- START OF FILE server/sockets/operationsSocket.js ---
/**
 * Al-Wassit Real-Time Event Bus
 * Broadcasts user operations to connected clients.
 */

const io = require('socket.io')();

const broadcastOperation = (userId, opData) => {
    // Structure expected by frontend
    const payload = {
        id: `op_${Date.now()}`,
        userId: userId,
        operationType: opData.type, // 'TRANSFER', 'LOAN', etc.
        amount: opData.amount,
        status: opData.status,
        timestamp: new Date().toISOString()
    };

    console.log(`[SOCKET] Emitting to ${userId}:`, payload);
    io.to(userId).emit('operation:update', payload);
};

// Example Trigger
// broadcastOperation('user_123', { type: 'P2P_TRANSFER', amount: 5000, status: 'SUCCESS' });

module.exports = { broadcastOperation };