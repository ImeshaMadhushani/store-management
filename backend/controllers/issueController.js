const db = require("../config/db");

/* exports.issueItem = (req, res) => {
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
 */

/* exports.issueItem = (req, res) => {
    const { item_id, quantity, branch, month, year } = req.body;
    if (!item_id || !quantity || !branch || !month || !year) {
        return res.status(400).send("All fields are required");
    }

    if (quantity <= 0) {
        return res.status(400).send("Quantity must be greater than 0");
    }
    const checkStockQuery = `
    SELECT 
        (
            (SELECT IFNULL(SUM(quantity),0) FROM stock_in WHERE item_id = ?)
            -
            (SELECT IFNULL(SUM(quantity),0) FROM stock_out WHERE item_id = ?)
        ) AS balance
`;

    db.query(checkStockQuery, [item_id, item_id], (err, result) => {
        if (err) return res.status(500).send(err);

        const balance = result[0].balance || 0;

        // 🚫 Prevent over issuing
        if (quantity > balance) {
            return res.status(400).send(`Not enough stock. Available: ${balance}`);
        }

        // ✅ Insert only if stock is enough
        db.query(
            "INSERT INTO stock_out (item_id, quantity, branch, month, year) VALUES (?, ?, ?, ?, ?)",
            [item_id, quantity, branch, month, year],
            (err2) => {
                if (err2) return res.status(500).send(err2);
                res.send("Item Issued Successfully");
            }
        );
    });
};
 */

exports.issueItem = (req, res) => {

    let { item_id, quantity, branch, month, year } = req.body;

    // Convert values
    item_id = Number(item_id);
    quantity = Number(quantity);
    year = Number(year);

    // Validation
    if (!item_id || !quantity || !branch || !month || !year) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    // Get available stock
    const checkStockQuery = `
        SELECT 
        (
            (SELECT IFNULL(SUM(quantity),0) FROM stock_in WHERE item_id = ?)
            -
            (SELECT IFNULL(SUM(quantity),0) FROM stock_out WHERE item_id = ?)
        ) AS balance
    `;

    db.query(checkStockQuery, [item_id, item_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        const balance = Number(result[0].balance || 0);

        console.log("Available Balance:", balance);
        console.log("Requested Quantity:", quantity);

        // Prevent over issue
        if (quantity > balance) {
            return res.status(400).json({
                message: `Not enough stock. Available: ${balance}`
            });
        }

        // Insert issue
        db.query(
            `INSERT INTO stock_out 
            (item_id, quantity, branch, month, year) 
            VALUES (?, ?, ?, ?, ?)`,
            [item_id, quantity, branch, month, year],
            (err2) => {

                if (err2) {
                    console.log(err2);

                    return res.status(500).json({
                        message: "Insert failed"
                    });
                }

                res.status(201).json({
                    message: "Item Issued Successfully"
                });
            }
        );

    });

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

exports.updateIssue = (req, res) => {
    const { id } = req.params;
    const { item_id, quantity, branch, month, year } = req.body;

    if (!item_id || !quantity || !branch) {
        return res.status(400).send("Item, quantity, and branch are required");
    }

    if (quantity <= 0) {
        return res.status(400).send("Invalid quantity");
    }

    db.query(
        "UPDATE stock_out SET item_id=?, quantity=?, branch=?, month=?, year=? WHERE id=?",
        [item_id, quantity, branch, month, year, id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Issue not found");
            }

            res.send("Issue Updated Successfully");
        }
    );
};

exports.deleteIssue = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM stock_out WHERE id=?",
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send("Issue not found");
            }

            res.send("Issue Deleted Successfully");
        }
    );
};

exports.getMonthlyIssues = (req, res) => {
    db.query(
        `SELECT 
            month,
            year,
            i.name,
            SUM(so.quantity) AS total_issued
        FROM stock_out so
        JOIN items i ON so.item_id = i.id
        GROUP BY month, year, i.id`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
};

exports.getYearlyIssues = (req, res) => {
    db.query(
        `SELECT 
            year,
            i.name,
            SUM(so.quantity) AS total_issued
        FROM stock_out so
        JOIN items i ON so.item_id = i.id
        GROUP BY year, i.id`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
};