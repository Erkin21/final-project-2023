const express = require("express");
//const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

// Replace <user>, <pass>, and <database_name> with your MongoDB Atlas credentials
const uri = "mongodb+srv://chatroom:chatroom123@cluster0.elo0giy.mongodb.net/?retryWrites=true&w=majority";

// MongoDB setup
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const chatSchema = new mongoose.Schema({
  username: String,
  text: String,
});

const ChatMessage = mongoose.model("ChatMessage", chatSchema);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  ChatMessage.find()
    .then((results) => {
      res.render("index.ejs", { mess: results });
    })
    .catch((error) => console.error(error));
});

// ... (existing code)

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " joined the conversation");

    // Retrieve chat history from MongoDB and send it to the new user
    ChatMessage.find()
      .then((messages) => {
        socket.emit("chatHistory", messages);
      })
      .catch((error) => {
        console.error("Error retrieving chat history:", error);
      });
  });

  socket.on("chat", function (message) {
    const newMessage = new ChatMessage(message);
    newMessage
      .save()
      .then(() => socket.broadcast.emit("chat", message))
      .catch((error) => console.error("Error saving message:", error));
  });
});

// ... (remaining code)

const PORT = 3000;

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
