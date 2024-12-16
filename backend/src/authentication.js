const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = (req, res, db) => {
    const { login_username_email, login_password } = req.body;

    // Kiểm tra xem email hoặc username có tồn tại trong database không
    const query = 'SELECT * FROM `user` WHERE `email` = ? OR `username` = ?';
    db.query(query, [login_username_email, login_username_email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }

        if (results.length === 1) {
            const user = results[0];
            // So sánh password đã mã hoá với password người dùng nhập vào, sử dụng thư viện bcrypt
            if (bcrypt.compareSync(login_password, user.password)) {
                const tokenPayload = {
                    username: user.username,
                    name: user.name,
                    iduser: user.iduser
                };
                // Tạo JWT token với payload là username, name và iduser
                const token = jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' });

                // Trả về response với token và thông tin user.
                return res.json({
                    message: `Hello ${user.username}! Mua sắm vui vẻ!`,
                    loggedin: true,
                    token: token,
                    user: {
                        username: user.username,
                        name: user.name
                    }
                });
            } else {
                // Nếu password không khớp thì trả về lỗi
                return res.status(401).json({ message: 'Incorrect password!' });
            }
        } else {
            // Nếu không tìm thấy email hoặc username thì trả về lỗi
            return res.status(401).json({ message: 'Invalid email/username!' });
        }
    });
};

const signup = (req, res, db) => {
    const { name, username, email, password, password2, address, phone, terms } = req.body;
    // Mã hoá password bằng thư viện bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);

    // Các ràng buộc dữ liệu
    const nameRegex = /^[a-zA-Z\s]+$/;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    const emailMaxLength = 70;
    const phoneMaxLength = 70;
    const addressMaxLength = 128;

    // Kiểm tra password có chứa ít nhất 1 số, 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt
    const number = /[0-9]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const specialChars = /[^\w]/.test(password);

    let errors = [];
    if (!terms) {
        errors.push('You have to agree with terms and conditions');
    }
    if (!nameRegex.test(name)) {
        errors.push('Invalid name. Please enter a name without special characters.');
    }
    if (!usernameRegex.test(username)) {
        errors.push('Invalid username. It must start with a letter and can contain only letters and numbers.');
    }
    if (email.length > emailMaxLength) {
        errors.push('Email cannot exceed ' + emailMaxLength + ' characters.');
    }
    if (phone.length > phoneMaxLength) {
        errors.push('Phone number cannot exceed ' + phoneMaxLength + ' characters.');
    }
    // Kiểm tra password có chứa ít nhất 1 số, 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt
    if (password.length < 8 || !number || !uppercase || !lowercase || !specialChars) {
        errors.push('Invalid password. It should contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    // Kiểm tra password và password2 có giống nhau không
    // Password2 là xác nhận password (confirm password)
    if (password !== password2) {
        errors.push('Passwords do not match.');
    }
    if (address.length > addressMaxLength) {
        errors.push('Address cannot exceed ' + addressMaxLength + ' characters.');
    }

    // Nếu có lỗi thì trả về lỗi vào trong response
    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join('\n') });
    }

    // Kiểm tra xem email, username và phone đã tồn tại trong database chưa
    const checkQuery = 'SELECT * FROM `user` WHERE `email` = ? OR `username` = ? OR `phonenumber` = ?';
    db.query(checkQuery, [email, username, phone], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred. Please try again later!' });
        }

        if (results.length > 0) {
            results.forEach(row => {
                if (row.email === email) {
                    errors.push('Email already exists.');
                }
                if (row.username === username) {
                    errors.push('Username already exists.');
                }
                if (row.phonenumber === phone) {
                    errors.push('Phone number already exists.');
                }
            });

            if (errors.length > 0) {
                return res.status(400).json({ message: errors.join('\n') });
            }
        }

        // Nếu không có lỗi thì thêm user vào database
        const insertQuery = 'INSERT INTO `user` (`name`, `username`, `email`, `password`, `address`, `phonenumber`) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [name, username, email, passwordHash, address, phone], (err) => {
            // Nếu có lỗi thì trả về lỗi vào trong response
            if (err) {
                return res.status(500).json({ message: 'Something went wrong! Please try again!' });
            }

            return res.json({ message: 'Signed up Successfully' });
        });
    });
};

module.exports = {
    login,
    signup
};