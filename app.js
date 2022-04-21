const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3080;

app.use(morgan("tiny"));

app.get("/api", (req,res) => {
	const data = {
		username: "random name",
		age: -1,
	};
	res.status(200).json(data);
});

app.listen(3080, console.log("server started at port: " + PORT));