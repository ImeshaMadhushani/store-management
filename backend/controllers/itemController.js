const db = require("../config/db");

/* exports.addItem = (req, res) => {
    const { name, unit, month, year } = req.body;

    db.query(
        "INSERT INTO items (name, unit, month, year) VALUES (?, ?, ?, ?)",
        [name, unit, month, year],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Item Added with Month & Year");
        }
    );
}; */

exports.addItem = (req, res) => {
    const { name, unit } = req.body;

    db.query(
        "INSERT INTO items (name, unit) VALUES (?, ?)",
        [name, unit],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Item Added");
        }
    );
};
exports.getItems = (req, res) => {
    db.query("SELECT * FROM items", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};