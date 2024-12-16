// Xử lý tạo mới đơn hàng
const createOrder = (req, res, db) => {
    const { order_date, status, total_amount, iduser } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!order_date || !status || !total_amount || !iduser) {
        return res.status(400).json({ message: 'Ngày đặt hàng, Trạng thái, Tổng tiền và ID người dùng là bắt buộc' });
    }

    // Thực hiện truy vấn để thêm đơn hàng mới vào database
    const query = 'INSERT INTO `order` (order_date, status, total_amount, iduser) VALUES (?, ?, ?, ?)';
    db.query(query, [order_date, status, total_amount, iduser], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        res.status(201).json({ message: 'Đơn hàng được tạo thành công', orderId: results.insertId });
    });
};

// Xử lý cập nhật đơn hàng
const editOrder = (req, res, db) => {
    const { id } = req.params;
    const { order_date, status, total_amount, iduser } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!order_date || !status || !total_amount || !iduser) {
        return res.status(400).json({ message: 'Ngày đặt hàng, Trạng thái, Tổng tiền và ID người dùng là bắt buộc' });
    }

    // Thực hiện truy vấn để cập nhật đơn hàng
    const query = 'UPDATE `order` SET order_date = ?, status = ?, total_amount = ?, iduser = ? WHERE order_id = ?';
    db.query(query, [order_date, status, total_amount, iduser, id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        // Nếu không tìm thấy đơn hàng thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json({ message: 'Đơn hàng được cập nhật thành công' });
    });
};

// Xử lý xóa đơn hàng
const deleteOrder = (req, res, db) => {
    const { id } = req.params;

    // Kiểm tra xem id đơn hàng có tồn tại không
    if (!id) {
        return res.status(400).json({ message: 'ID đơn hàng là bắt buộc' });
    }

    // Thực hiện truy vấn để xóa đơn hàng
    const query = 'DELETE FROM `order` WHERE order_id = ?';
    db.query(query, [id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        // Nếu không tìm thấy đơn hàng thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json({ message: 'Đơn hàng được xóa thành công' });
    });
};

// Xử lý lấy danh sách đơn hàng
const getOrders = (req, res, db) => {
    const query = 'SELECT * FROM `order`';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        res.json(results);
    });
};

module.exports = {
    createOrder,
    editOrder,
    deleteOrder,
    getOrders
};