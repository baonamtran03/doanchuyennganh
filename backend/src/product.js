// Xử lý tạo mới sản phẩm
//req: Đối tượng yêu cầu (request) chứa thông tin từ client gửi lên.
//res: Đối tượng phản hồi (response) dùng để gửi phản hồi lại cho client.
//db: Đối tượng kết nối cơ sở dữ liệu MySQL.
const createProduct = (req, res, db) => {
    const { name, type, description, category, price, imagepath, imagepathhover, old_price } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!name || !type || !description || !category || !price || !imagepath) {
        return res.status(400).json({ message: 'Name, Type, Description, Category, Price, and Image Path are required' });
    }

    // Thực hiện truy vấn để thêm sản phẩm mới vào database
    const query = 'INSERT INTO product (name, type, description, category, price, imagepath, imagepathhover, old_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, type, description, category, price, imagepath, imagepathhover, old_price], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        res.status(201).json({ message: 'Product created successfully', productId: results.insertId });
    });
};

// Xử lý cập nhật sản phẩm
const editProduct = (req, res, db) => {
    const { id } = req.params;
    const { name, type, description, category, price, imagepath, imagepathhover, old_price } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!name || !type || !description || !category || !price || !imagepath) {
        return res.status(400).json({ message: 'Name, Type, Description, Category, Price, and Image Path are required' });
    }

    // Thực hiện truy vấn để cập nhật sản phẩm
    const query = 'UPDATE product SET name = ?, type = ?, description = ?, category = ?, price = ?, imagepath = ?, imagepathhover = ?, old_price = ? WHERE idproduct = ?';
    db.query(query, [name, type, description, category, price, imagepath, imagepathhover, old_price, id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        // Nếu không tìm thấy sản phẩm thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    });
};

// Xử lý xóa sản phẩm
const deleteProduct = (req, res, db) => {
    const { id } = req.params;

    // Kiểm tra xem id sản phẩm có tồn tại không
    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    // Thực hiện truy vấn để xóa sản phẩm
    const query = 'DELETE FROM product WHERE idproduct = ?';
    db.query(query, [id], (err, results) => {
        // Nếu có lỗi thì trả về thông báo lỗi
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        // Nếu không tìm thấy sản phẩm thì trả về lỗi
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
};

const getProducts = (req, res, db) => {
    let sql = "SELECT * FROM product WHERE 1=1";
    const filters = [];
    const { category, type, price, name, times_sold, productId, sort, limit } = req.query;

    if (category) {
        filters.push(`category = '${db.escape(category)}'`);
    }
    if (type) {
        filters.push(`type = '${db.escape(type)}'`);
    }
    if (price) {
        filters.push(`price <= ${parseFloat(price)}`);
    }
    if (productId) {
        filters.push(`idproduct = ${parseInt(productId)}`);
    }
    if (name) {
        filters.push(`(name LIKE '%${db.escape(name)}%' OR description LIKE '%${db.escape(name)}%')`);
    }
    if (times_sold) {
        filters.push(`times_sold >= ${parseInt(times_sold)}`);
    }

    if (filters.length > 0) {
        sql += " AND " + filters.join(" AND ");
    }

    switch (sort) {
        case 'times_sold':
            sql += " ORDER BY times_sold DESC";
            break;
        case 'added_time':
            sql += " ORDER BY date_added DESC";
            break;
        case 'sale_percentage':
            sql += " AND old_price > price AND old_price IS NOT NULL ORDER BY (1 - (price / old_price)) DESC";
            break;
        default:
            sql += " ORDER BY idproduct DESC";
            break;
    }

    if (limit) {
        sql += ` LIMIT ${parseInt(limit)}`;
    }

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }
        res.json(results);
    });
};

module.exports = {
    createProduct,
    editProduct,
    deleteProduct,
    getProducts
};