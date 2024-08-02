const mysql = require('mysql2');
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    // host: 'wht.h.filess.io',
    // user: 'userdetail01_government',
    // password: '3983d735dee8a76536b56aa5f74f089e2f913d6c',
    // database: 'userdetail01_government',
    // port : 3307
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'usermenagement'
});

connection.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Database connected.')
    }
});

exports.signup = (req, res) => {
    const { first_name, last_name, email, phone_number, username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.json({ message: 'Passwords do not match' });
    }

    // Check if username is unique
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during username check:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.json({ message: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err); // Log detailed error
                return res.json({ message: 'Error hashing password' });
            }

            const query = 'INSERT INTO users (first_name, last_name, email, phone_number, username, password) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(query, [first_name, last_name, email, phone_number, username, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Database error during insertion:', err); // Log detailed error
                    return res.json({ message: 'Database error' });
                }
                res.json({ message: 'User registered successfully' });
            });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error during login:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Invalid username' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err); // Log detailed error
                return res.json({ message: 'Error comparing passwords' });
            }

            if (!match) {
                return res.json({ message: 'Invalid password' });
            }

            res.json({ message: 'Login successful' });
        });
    });
};

exports.updateDetails = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number } = req.body;
   
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error during ID check:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Invalid user ID' });
        }
    
        const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE id = ?';
        connection.query(query, [first_name, last_name, email, phone_number, id], (err, results) => {
            if (err) {
                console.error('Database error during update:', err); // Log detailed error
                return res.json({ message: 'Database error' });
            }
            res.json({ message: 'User details updated successfully' });
        });
    });
};


exports.changePassword = (req, res) => {
    const { username, old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
        return res.json({ message: 'New passwords do not match' });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error during username check:', err);
            return res.json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Invalid username' });
        }

        const user = results[0];
        bcrypt.compare(old_password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.json({ message: 'Error comparing passwords' });
            }

            if (!match) {
                return res.json({ message: 'Invalid old password' });
            }

            bcrypt.hash(new_password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing new password:', err);
                    return res.json({ message: 'Error hashing new password' });
                }

                const query = 'UPDATE users SET password = ? WHERE username = ?';
                connection.query(query, [hashedPassword, username], (err, results) => {
                    if (err) {
                        console.error('Database error during password update:', err);
                        return res.json({ message: 'Database error' });
                    }
                    res.json({ message: 'Password changed successfully' });
                });
            });
        });
    });
};


exports.insertBusiness = (req, res) => {
    const { business_name, userid } = req.body;

    const query = 'INSERT INTO business (business_name, userid) VALUES (?, ?)';
    connection.query(query, [business_name, userid], (err, results) => {
        if (err) {
            console.error('Database error during insertion:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business inserted successfully', business_id: results.insertId });
    });
};

exports.updateBusiness = (req, res) => {
    const { business_id } = req.params;
    const { business_name, userid } = req.body;

    const query = 'UPDATE business SET business_name = ?, userid = ? WHERE business_id = ?';
    connection.query(query, [business_name, userid, business_id], (err, results) => {
        if (err) {
            console.error('Database error during update:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business updated successfully' });
    });
};

exports.deleteBusiness = (req, res) => {
    const { business_id } = req.params;

    const query = 'DELETE FROM business WHERE business_id = ?';
    connection.query(query, [business_id], (err, results) => {
        if (err) {
            console.error('Database error during deletion:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business deleted successfully' });
    });
};



exports.insertBusinessCategory = (req, res) => {
    const { category_name, business_id, userid, category_type } = req.body;

    const query = 'INSERT INTO business_category (category_name, business_id, userid, category_type) VALUES (?, ?, ?, ?)';
    connection.query(query, [category_name, business_id, userid, category_type], (err, results) => {
        if (err) {
            console.error('Database error during insertion:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business category inserted successfully', category_id: results.insertId });
    });
};

exports.updateBusinessCategory = (req, res) => {
    const { category_id } = req.params;
    const { category_name, business_id, userid, category_type } = req.body;

    const query = 'UPDATE business_category SET category_name = ?, business_id = ?, userid = ?, category_type = ? WHERE category_id = ?';
    connection.query(query, [category_name, business_id, userid, category_type, category_id], (err, results) => {
        if (err) {
            console.error('Database error during update:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business category updated successfully' });
    });
};

exports.deleteBusinessCategory = (req, res) => {
    const { category_id } = req.params;

    const query = 'DELETE FROM business_category WHERE category_id = ?';
    connection.query(query, [category_id], (err, results) => {
        if (err) {
            console.error('Database error during deletion:', err); // Log detailed error
            return res.json({ message: 'Database error' });
        }
        res.json({ message: 'Business category deleted successfully' });
    });
};



// {
//     "category_name": "Software Development",
//     "business_id": 1,
//     "userid": 1,
//     "category_type": "Service"
// }
// {
//     "category_name": "Software and IT",
//     "business_id": 1,
//     "userid": 1,
//     "category_type": "Service"
// }

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     first_name VARCHAR(50) NOT NULL,
//     last_name VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL,
//     phone_number VARCHAR(15) NOT NULL,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
// ); 


// {
//     "first_name": "John",
//     "last_name": "Doe",
//     "email": "john.doe@example.com",
//     "phone_number": "1234567890",
//     "username": "john_doe",
//     "password": "password123",
//     "confirm_password": "password123"
// }

// {
//     "username": "john_doe",
//     "password": "password123"
// }

// {
//     "first_name": "John",
//     "last_name": "Doe",
//     "email": "john.doe@example.com",
//     "phone_number": "0987654321"
// }

// {
//     "username": "john_doe",
//     "old_password": "password123",
//     "new_password": "newpassword123",
//     "confirm_password": "newpassword123"
// }



// change password usename validation pas confpass
// business b id bisness name user id  //inser update del
//business catogery / cid cname bid uid catogry type (cash in out) in up del



//1) in your user api make new api wich uses for chnage passwor valodations 
//  1check username is valid or not
// get old password is valid or not
//  get new password and confirm password check bothn are saim


// 2) make business tabel in db
// inser colmn business id business name userid (foreign key)
// make inser update delet api 


// 3) make business category tabel 
// inser row category id cateegoryb name buisness id (fk) userid (fk) category type 
// make inser update delet api 