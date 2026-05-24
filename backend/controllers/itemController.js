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

/* exports.addItem = (req, res) => {
    const { name, unit } = req.body;

    db.query(
        "INSERT INTO items (name, unit) VALUES (?, ?)",
        [name, unit],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Item Added");
        }
    );
}; */

exports.addItem = (req, res) => {
    const { name, unit } = req.body;

    if (!name || !unit) {
        return res.status(400).send("Name and unit are required");
    }

    // 🔍 Check if item already exists
    db.query(
        "SELECT * FROM items WHERE name = ?",
        [name],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length > 0) {
                return res.status(400).send("Item already exists");
            }

            // ✅ Insert new item
            db.query(
                "INSERT INTO items (name, unit) VALUES (?, ?)",
                [name, unit],
                (err2) => {
                    if (err2) return res.status(500).send(err2);

                    res.send("Item Added Successfully");
                }
            );
        }
    );
};

exports.getItems = (req, res) => {
    db.query("SELECT * FROM items", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

exports.updateItem = (req, res) => {
    const { id } = req.params;
    const { name, unit } = req.body;

    if (!name || !unit) {
        return res.status(400).send("Name and unit are required");
    }

    db.query(
        "UPDATE items SET name=?, unit=? WHERE id=?",
        [name, unit, id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Item not found");
            }

            res.send("Item Updated Successfully");
        }
    );
};

exports.deleteItem = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM items WHERE id=?",
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Item not found");
            }

            res.send("Item Deleted Successfully");
        }
    );
};