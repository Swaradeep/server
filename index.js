const server = require("express");
const cors = require("cors");
const {
  getUserByEmail,
  createUser,
  getUserByEmailAndPassword,
  getConnectionsByUserEmail,
  getRecomendedConnections,
  addConnection,
} = require("./service/user/UserService");
const app = server();
const PORT = 8080;

app.use(server.json());
app.use(cors());

const wss = require("./service/socket/socket");

setInterval(() => {
  wss.wss.clients.forEach((client) => {
    client.send("You've got a message at " + new Date().toLocaleTimeString());
  });
}, 1000);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  } else {
    const data = await getUserByEmailAndPassword(email, password);
    console.log(data);
    if (data) {
      res.send({ token: "123", ...data });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  } else {
    const data = await createUser({ email, password });
    console.log(data);
    res.send({ token: "123", data });
  }
});

app.get("/connections/:email", async (req, res) => {
  const { email } = req.params;
  const data = await getConnectionsByUserEmail(email);
  console.log(data);
  res.send(data);
});

app.get("/recommendations/:email", async (req, res) => {
  const { email } = req.params;
  const data = await getRecomendedConnections(email);
  console.log(data);
  res.send(data);
});

app.post("/addConnection", async (req, res) => {
  const { email, connectionEmail } = req.body;
  if (!email || !connectionEmail) {
    res.status(400).send("Email and connectionEmail are required");
  } else {
    // Add the connection to the connections table
    const data = await addConnection(email, connectionEmail);
    const user = await getUserByEmail(data.con_email);
    res.send(user);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
