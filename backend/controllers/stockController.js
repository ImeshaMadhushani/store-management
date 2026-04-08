const db = require("../config/db");

exports.addStock = (req, res) => {
    const { item_id, quantity, month, year } = req.body;

    db.query(
        "INSERT INTO stock_in (item_id, quantity, month, year) VALUES (?, ?, ?, ?)",
        [item_id, quantity, month, year],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Stock Added");
        }
    );
};

exports.getReport = (req, res) => {
    db.query(
        `SELECT 
      i.id,
      i.name,
      IFNULL(SUM(si.quantity),0) AS total_in,
      IFNULL(SUM(so.quantity),0) AS total_out,
      (IFNULL(SUM(si.quantity),0) - IFNULL(SUM(so.quantity),0)) AS balance
    FROM items i
    LEFT JOIN stock_in si ON i.id = si.item_id
    LEFT JOIN stock_out so ON i.id = so.item_id
    GROUP BY i.id`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json(result);
        }
    );
};

exports.getMonthlyStock = (req, res) => {
    db.query(
        `SELECT 
      month,
      year,
      i.name,
      SUM(si.quantity) AS total_added
    FROM stock_in si
    JOIN items i ON si.item_id = i.id
    GROUP BY month, year, i.id`,
        (err, result) => {
            if (err) return res.status(500).send(err);
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
