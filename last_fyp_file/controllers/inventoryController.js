// controllers/inventoryController.js

const db = require("../utils/database"); // Ensure you have a database utility

const createInventoryItem = async (req, res) => {
    const { name, features, stockAmount, image ,price} = req.body;
    
    // Check if all fields are provided
    if (!name || !features || !stockAmount || !image || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Build the SQL query string with string interpolation
        const createInventoryQuery = `
            INSERT INTO inventory (name, image, features, stockAmount,price)
            VALUES ('${name}', '${image}', '${JSON.stringify(features)}', '${stockAmount}','${price}')
        `;

        // Execute the query
        db.query(createInventoryQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error occurred' });
            }

            // Return success response with the inserted item ID
            res.status(201).json({ message: 'Inventory item created', id: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};

const getAllInventoryItems = (req, res) => {

    db.query('SELECT * FROM inventory', (err, rows) => {
        if (err) {
            console.error("Error occurred:", err.message);
            return res.status(500).json({ error: 'Failed to fetch inventory items' });
        }

        if (rows.length === 0) {
            console.log({ message: 'No inventory items found' });
            return res.status(200).json([]);
        }
        res.status(200).json(rows);
    });
};




const getInventoryItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const inventoryQuery = `SELECT * FROM inventory WHERE id="${id}"`; // Keeping the query as is
        db.query(inventoryQuery, (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error occurred' });

            if (results.length === 0) {
                // If no item is found, return a 404 response
                return res.status(404).json({ message: 'Inventory item not found' });
            }

            // If item is found, return the item
            return res.status(200).json(results[0]);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve inventory item' });
    }
};

const updateInventoryItem = async (req, res) => {
    const { id } = req.params;
    const { name, image, features, stockAmount, price } = req.body;

    // Ensure all fields are provided
    if (!name || !image || !features || !stockAmount || !price) {
        return res.status(400).json({ message: 'All fields (name, image, features, stockAmount, price) are required' });
    }

    try {
        // Convert features into a JSON string if it's an array
        const featuresString = Array.isArray(features) ? JSON.stringify(features) : features;

        // Correct SQL query with proper quoting
        const updateInventoryQuery = `
            UPDATE inventory 
            SET name = '${name}', image = '${image}', features = '${featuresString}', stockAmount = '${stockAmount}', price = '${price}'
            WHERE id = '${id}'
        `;

        // Execute the query
        db.query(updateInventoryQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error occurred' });
            }

            if (results.affectedRows === 0) {
                // No item found with the given ID
                return res.status(404).json({ message: 'Inventory item not found' });
            }

            // Send success response
            res.status(200).json({ message: 'Inventory item updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
};

// Delete Inventory Item
const deleteInventoryItem = async (req, res) => {
    const { id } = req.params;  // Get the item ID from the request parameters
    try {
        console.log("deleting")
        const result = await new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM inventory WHERE id = ${id}`,
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        if (result.affectedRows === 0) {
            // No item found to delete
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        // Successful deletion
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
};

module.exports = {
    createInventoryItem,
    getAllInventoryItems,
    getInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem,
};
