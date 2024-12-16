// Xử lý tạo mới kho
const createWarehouse = (req, res, db) => {
    const { idproduct, soluong } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!idproduct || !soluong) {
        return res.status(400).json({ message: 'Product ID and Quantity are required' });
    }

    // Thực hiện truy vấn để thêm kho mới vào database
    const query = 'INSERT INTO kho (idproduct, soluong) VALUES (?, ?)';
    db.query(query, [idproduct, soluong], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        res.status(201).json({ message: 'Warehouse entry created successfully', warehouseId: results.insertId });
    });
};

// Xử lý cập nhật kho
const editWarehouse = (req, res, db) => {
    const { id } = req.params;
    const { idproduct, soluong } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!idproduct || !soluong) {
        return res.status(400).json({ message: 'Product ID and Quantity are required' });
    }

    // Thực hiện truy vấn để cập nhật kho
    const query = 'UPDATE kho SET idproduct = ?, soluong = ? WHERE idwardhouse = ?';
    db.query(query, [idproduct, soluong, id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        // Nếu không tìm thấy kho thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Warehouse entry not found' });
        }
        res.json({ message: 'Warehouse entry updated successfully' });
    });
};

// Xử lý xóa kho
const deleteWarehouse = (req, res, db) => {
    const { id } = req.params;

    // Kiểm tra xem id kho có tồn tại không
    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }

    // Thực hiện truy vấn để xóa kho
    const query = 'DELETE FROM kho WHERE idwardhouse = ?';
    db.query(query, [id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        // Nếu không tìm thấy kho thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Warehouse entry not found' });
        }
        res.json({ message: 'Warehouse entry deleted successfully' });
    });
};

// Xử lý lấy danh sách kho
const getWarehouses = (req, res, db) => {
    const query = 'SELECT * FROM kho';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        res.json(results);
    });
};

module.exports = {
    createWarehouse,
    editWarehouse,
    deleteWarehouse,
    getWarehouses
};