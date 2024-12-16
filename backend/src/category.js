//Khi tạo mới
//req: Đối tượng yêu cầu (request) chứa thông tin từ client gửi lên.
//res: Đối tượng phản hồi (response) dùng để gửi phản hồi lại cho client.
//db: Đối tượng kết nối cơ sở dữ liệu MySQL.
const createCategory = (req, res, db) => {
    // thêm một sản phẩm mới vào cơ sở dữ liệu.
    const { danhmucchinh, tendanhmuc, lienket } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc, lỗi 400 là thiếu
    if (!danhmucchinh || !tendanhmuc || !lienket) {
        return res.status(400).json({ message: 'Danh mục chính, Tên danh mục, và Liên kết là bắt buộc' });
    }

     // Thực hiện truy vấn để thêm danh mục mới vào database
     const query = 'INSERT INTO danhmuc (danhmucchinh, tendanhmuc, lienket) VALUES (?, ?, ?)';
     db.query(query, [danhmucchinh, tendanhmuc, lienket], (err, results) => {
         if (err) {
             return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
         }
         res.status(201).json({ message: 'Danh mục được tạo thành công', categoryId: results.insertId });
     });
 };

 //cập nhật danh mục
 const editCategory = (req, res, db) => {
    //lấy dữ liệu từ yêu cầu
    const { id } = req.params;
    const { danhmucchinh, tendanhmuc, lienket } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    if (!danhmucchinh || !tendanhmuc || !lienket) {
        return res.status(400).json({ message: 'Danh mục chính, Tên danh mục, và Liên kết là bắt buộc' });
    }

    // Thực hiện truy vấn để cập nhật danh mục
    const query = 'UPDATE danhmuc SET danhmucchinh = ?, tendanhmuc = ?, lienket = ? WHERE id = ?';
    db.query(query, [danhmucchinh, tendanhmuc, lienket, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json({ message: 'Danh mục được cập nhật thành công' });
    });
};

//xóa danh mục
const deleteCategory = (req, res, db) => {
    const { id } = req.params;

    // Kiểm tra xem id danh mục có tồn tại không
    if (!id) {
        return res.status(400).json({ message: 'ID danh mục là bắt buộc' });
    }

    // Thực hiện truy vấn để xóa danh mục
    const query = 'DELETE FROM danhmuc WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json({ message: 'Danh mục được xóa thành công' });
    });
};

//lấy danh mục
const getCategories = (req, res, db) => {
    const query = 'SELECT * FROM danhmuc';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!' });
        }
        res.json(results);
    });
};

module.exports = {
    createCategory,
    editCategory,
    deleteCategory,
    getCategories
};