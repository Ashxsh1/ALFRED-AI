
require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const mongoose = require("mongoose");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema 
const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  bot: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a model 
const Message = mongoose.model("Message", messageSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const prompt = `User: ${message}\nBot:`;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
    const { choices } = response.data;
    const { text } = choices[0];

    // Save the messages
    const newMessage = new Message({
      user: message,
      bot: text.trim(),
    });
    await newMessage.save();

    res.json({ message: text.trim() });
  } catch (error) {
    console.error(error);
    res.json({ message: "Sorry, I am not able to process your request." });
  }
});