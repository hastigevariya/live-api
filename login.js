const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
// const salt = 10;


var connection = mysql.createConnection({
    host: 'zzs.h.filess.io',
    user: 'project01_mixslabsto',
    password: '1234567890123456789',
    database: 'project01_mixslabsto',
    port: '3307'
    // host: 'localhost',
    // user: 'root',
    // password: 'root',
    // database: 'dbstudent'
});


connection.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Database connected.')
    }
});


// exports.userregister = async (req, res) => {
//     var {username, password } = req.body;


//     password =await bcrypt.hash(password,salt)
//     console.log(password);
//     const user = {
//         username,
//         password
//     };


//     const sql = 'INSERT INTO tbl_user SET ?';


//     connection.query(sql, user,
//         function (error, results, fields) {
//             if (error) throw error;
//             return res.send({
//                 data: results,
//                 message: 'User added'
//             });
//         });
// };


// exports.userlogin = async (req, res) => {
//     var {username, password } = req.body;


//     //password =await bcrypt.hash(password,salt)
//     //console.log(password);
//    //


//     const sql = 'select * from tbl_user where username = ?';


//     connection.query(sql, [req.body.username],
//         function (error, results, fields) {
//             if (error) throw error;



//             if(results.length>0){
//                 console.log(results)
//                 bcrypt.compare(req.body.password,results[0].password).then(function(isexist){
//                     console.log(isexist)
//                     if(isexist){
//                         return res.send({
//                             data: results,
//                             message: 'Login successfully.'
//                         });
//                     }else{
//                         return res.send({
//                             data: [],
//                             message: 'Password is wrong.'
//                         });
//                     }
//                 })


//             }else{
//                 return res.send({
//                     data: [],
//                     message: 'User not exist'
//                 });
//             }

//         });
// };



exports.transactionin = (req, res) => {
    const { transaction_id, date, remark, category_id, category_type, amount } = req.body;


    const transaction = {
        transaction_id,
        date,
        remark,
        category_id,
        category_type,
        amount
    };


    const sql = 'INSERT INTO tbl_transaction SET ?';


    connection.query(sql, transaction,
        function (error, results, fields) {
            if (error) throw error;
            return res.send({
                data: results,
                message: 'Transaction added'
            });
        });
};



exports.updateTransaction = (req, res) => {
    const { transaction_id } = req.params;
    const { date, remark, category_id, category_type, amount } = req.body;


    const sql = 'UPDATE tbl_transaction SET date = ?, remark = ?, category_id = ?, category_type = ?, amount = ? WHERE transaction_id = ?';


    connection.query(sql, [date, remark, category_id, category_type, amount, transaction_id], (error, results, fields) => {
        if (error) throw error;
        return res.send({
            data: results,
            message: 'Transaction updated'
        });
    });
};



exports.net_balance = (req, res) => {
    const sqlIn = 'SELECT SUM(amount) AS total_in FROM tbl_transaction WHERE category_type = "In"';
    const sqlOut = 'SELECT SUM(amount) AS total_out FROM tbl_transaction WHERE category_type = "Out"';


    connection.query(sqlIn, (err, resultIn) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }


        connection.query(sqlOut, (err, resultOut) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }


            const totalIn = resultIn[0].total_in || 0;
            const totalOut = resultOut[0].total_out || 0;
            const netBalance = totalIn - totalOut;


            res.status(200).json({
                total_in: totalIn,
                total_out: totalOut,
                net_balance: netBalance
            });
        });
    });
};




exports.yearly_totals = (req, res) => {
    const year = req.query.year;


    if (!year) {
        return res.status(400).json({ error: 'Please provide a year' });
    }


    const sqlIn = 'SELECT SUM(amount) AS total_in FROM tbl_transaction WHERE category_type = "In" AND YEAR(date) = ?';
    const sqlOut = 'SELECT SUM(amount) AS total_out FROM tbl_transaction WHERE category_type = "Out" AND YEAR(date) = ?';


    connection.query(sqlIn, [year], (err, resultIn) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }


        connection.query(sqlOut, [year], (err, resultOut) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }


            const totalIn = resultIn[0].total_in || 0;
            const totalOut = resultOut[0].total_out || 0;


            res.status(200).json({
                year: year,
                total_in: totalIn,
                total_out: totalOut
            });
        });
    });
};



// i wann to make it 1) make badtabse in mysql userid auto firstname namr last name email mo number  usernme (unique) passwoed confirm passwod 
//use singin usename unique  password  confirm pass saim  encript store in db
// upadate 
// login usename validation
// password 


// sucess else 