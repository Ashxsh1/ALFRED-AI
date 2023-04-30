const Message = require('./models/message'); // Import the Message model

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Delete all messages
Message.deleteMany({}, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('All messages deleted successfully');
  mongoose.connection.close(); // Close the database connection
});
