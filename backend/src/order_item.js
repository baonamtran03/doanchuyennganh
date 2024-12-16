// Xử lý tạo mới mục đơn hàng
const createOrderItem = (req, res, db) => {
    const { order_id, product_id, quantity, unit_price } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!order_id || !product_id || !quantity || !unit_price) {
        return res.status(400).json({ message: 'Mã đơn hàng, Mã sản phẩm, Số lượng và Đơn giá là bắt buộc' });
    }

    // Thực hiện truy vấn để thêm mục đơn hàng mới vào database
    const query = 'INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
    db.query(query, [order_id, product_id, quantity, unit_price], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        res.status(201).json({ message: 'Mục đơn hàng được tạo thành công', orderItemId: results.insertId });
    });
};

// Xử lý cập nhật mục đơn hàng
const editOrderItem = (req, res, db) => {
    const { id } = req.params;
    const { order_id, product_id, quantity, unit_price } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!order_id || !product_id || !quantity || !unit_price) {
        return res.status(400).json({ message: 'Mã đơn hàng, Mã sản phẩm, Số lượng và Đơn giá là bắt buộc' });
    }

    // Thực hiện truy vấn để cập nhật mục đơn hàng
    const query = 'UPDATE order_item SET order_id = ?, product_id = ?, quantity = ?, unit_price = ? WHERE order_item_id = ?';
    db.query(query, [order_id, product_id, quantity, unit_price, id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        // Nếu không tìm thấy mục đơn hàng thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mục đơn hàng' });
        }
        res.json({ message: 'Mục đơn hàng được cập nhật thành công' });
    });
};

// Xử lý xóa mục đơn hàng
const deleteOrderItem = (req, res, db) => {
    const { id } = req.params;

    // Kiểm tra xem id mục đơn hàng có tồn tại không
    if (!id) {
        return res.status(400).json({ message: 'ID mục đơn hàng là bắt buộc' });
    }

    // Thực hiện truy vấn để xóa mục đơn hàng
    const query = 'DELETE FROM order_item WHERE order_item_id = ?';
    db.query(query, [id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        // Nếu không tìm thấy mục đơn hàng thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mục đơn hàng' });
        }
        res.json({ message: 'Mục đơn hàng được xóa thành công' });
    });
};

// Xử lý lấy danh sách mục đơn hàng
const getOrderItems = (req, res, db) => {
    const query = 'SELECT * FROM order_item';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        res.json(results);
    });
};

module.exports = {
    createOrderItem,
    editOrderItem,
    deleteOrderItem,
    getOrderItems
};