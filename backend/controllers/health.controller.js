import mongoose from 'mongoose';

export const getHealthStatus = (req, res) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  res.status(200).json({
    success: true,
    message: "FoodBridge API is running",
    timestamp: new Date().toISOString(),
    database: {
      status: stateMap[dbState] || 'unknown',
      isConnected: isDbConnected,
      name: mongoose.connection.name || 'foodbridge_db'
    }
  });
};
