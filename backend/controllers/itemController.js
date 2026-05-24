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

/* exports.deleteItem = (req, res) => {
    const { id } = req.params;

    console.log("Deleting item ID:", id);

    db.query(
        "DELETE FROM items WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                console.error("Delete Error:", err);

                return res.status(500).json({
                    message: "Database delete failed",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }

            res.json({
                message: "Item Deleted Successfully"
            });
        }
    );
}; */

exports.deleteItem = (req, res) => {
    const { id } = req.params;

    // Delete stock_in records first
    db.query(
        "DELETE FROM stock_in WHERE item_id = ?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            // Then delete item
            db.query(
                "DELETE FROM items WHERE id = ?",
                [id],
                (err2, result) => {

                    if (err2) {
                        return res.status(500).json(err2);
                    }

                    res.json({
                        message: "Item and related stock deleted"
                    });
                }
            );
        }
    );
};