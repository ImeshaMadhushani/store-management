const db = require("../config/db");

/* exports.addStock = (req, res) => {
    const { item_id, quantity, month, year } = req.body;

    db.query(
        "INSERT INTO stock_in (item_id, quantity, month, year) VALUES (?, ?, ?, ?)",
        [item_id, quantity, month, year],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Stock Added");
        }
    );
}; */

exports.addStock = (req, res) => {
    const { item_id, quantity, month, year } = req.body;

    // ✅ Validation
    if (!item_id || !quantity) {
        return res.status(400).send("Item and quantity required");
    }

    if (quantity <= 0) {
        return res.status(400).send("Quantity must be greater than 0");
    }

    db.query(
        "INSERT INTO stock_in (item_id, quantity, month, year) VALUES (?, ?, ?, ?)",
        [item_id, quantity, month, year],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Stock Added Successfully");
        }
    );
}; 
/* exports.updateStock = (req, res) => {
    const { id } = req.params;
    const { item_id, quantity, month, year } = req.body;

    if (!item_id || !quantity) {
        return res.status(400).send("Item and quantity required");
    }

    if (quantity <= 0) {
        return res.status(400).send("Quantity must be greater than 0");
    }

    db.query(
        "UPDATE stock_in SET item_id=?, quantity=?, month=?, year=? WHERE id=?",
        [item_id, quantity, month, year, id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Stock not found");
            }

            res.send("Stock Updated Successfully");
        }
    );
}; */

// UPDATE STOCK
exports.updateStock = (req, res) => {

    const { id } = req.params;

    const { item_id, quantity, month, year } = req.body;

    if (!item_id || !quantity) {
        return res.status(400).json({
            message: "Item and quantity required"
        });
    }

    if (quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    db.query(
        `UPDATE stock_in 
        SET item_id=?, quantity=?, month=?, year=? 
        WHERE id=?`,
        [item_id, quantity, month, year, id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Stock not found"
                });
            }

            res.json({
                message: "Stock Updated Successfully"
            });
        }
    );
};


/* exports.deleteStock = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM stock_in WHERE id=?",
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Stock not found");
            }

            res.send("Stock Deleted Successfully");
        }
    );
}; */

// DELETE STOCK
exports.deleteStock = (req, res) => {

    const { id } = req.params;

    db.query(
        `DELETE FROM stock_in WHERE id=?`,
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Stock not found"
                });
            }

            res.json({
                message: "Stock Deleted Successfully"
            });
        }
    );
};

exports.getReport = (req, res) => {
    db.query(
        `SELECT
    i.id,
    i.name,
    (SELECT IFNULL(SUM(quantity),0) FROM stock_in WHERE item_id = i.id) AS total_in,
    (SELECT IFNULL(SUM(quantity),0) FROM stock_out WHERE item_id = i.id) AS total_out,
    (
        (SELECT IFNULL(SUM(quantity),0) FROM stock_in WHERE item_id = i.id)
        -
        (SELECT IFNULL(SUM(quantity),0) FROM stock_out WHERE item_id = i.id)
    ) AS balance
FROM items i;`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json(result);
        }
    );
};

/* exports.getMonthlyStock = (req, res) => {
    db.query(
        `SELECT 
      month,
      year,
      i.name,
      SUM(si.quantity) AS total_added,
       created_at,
    updated_at
    FROM stock_in si
    JOIN items i ON si.item_id = i.id
    ORDER BY si.created_at DESC`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
}; */

exports.getMonthlyStock = (req, res) => {
    db.query(
        `SELECT 
            si.id,
            si.item_id,
            si.month,
            si.year,
            i.name,
            si.quantity AS total_added,
            si.created_at,
            si.updated_at
        FROM stock_in si
        JOIN items i ON si.item_id = i.id
        ORDER BY si.created_at DESC`,
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json(result);
        }
    );
};

exports.getYearlyStock = (req, res) => {
    db.query(
        `SELECT 
            year,
            i.name,
            SUM(si.quantity) AS total_added
        FROM stock_in si
        JOIN items i ON si.item_id = i.id
        GROUP BY year, i.id`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
};
