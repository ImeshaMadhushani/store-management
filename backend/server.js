const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));