const db = require("../config/db");

exports.issueItem = (req, res) => {
    const { item_id, quantity, branch, month, year } = req.body;

    db.query(
        "INSERT INTO stock_out (item_id, quantity, branch, month, year) VALUES (?, ?, ?, ?, ?)",
        [item_id, quantity, branch, month, year],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Item Issued");
        }
    );
};

exports.getIssues = (req, res) => {
    db.query(
        `SELECT so.*, i.name as item_name
     FROM stock_out so
     JOIN items i ON so.item_id = i.id`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
};