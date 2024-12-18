const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Ganti dengan password database Anda
    database: 'penilaian_pembinaan'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname))); // Menyajikan file statis dari direktori proyek

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk halaman penginputan
app.get('/survey', (req, res) => {
    res.sendFile(path.join(__dirname, 'penginputan.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pkl-login.html'));
});

// Middleware untuk memeriksa autentikasi
const bcrypt = require('bcrypt');

// Route untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Ambil data admin dari database
    const sql = 'SELECT * FROM admins WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const admin = results[0];

            // Bandingkan password yang dimasukkan dengan password yang disimpan
            bcrypt.compare(password, admin.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    // Simpan status autentikasi
                    res.json({ success: true, message: 'Login berhasil', isAdmin: true });
                } else {
                    res.json({ success: false, message: 'Username atau password salah' });
                }
            });
        } else {
            res.json({ success: false, message: 'Username atau password salah' });
        }
    });
});

// Route untuk logout
app.get('/logout', (req, res) => {
    res.redirect('/login'); // Redirect ke halaman login
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'hasilpenilaian.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route untuk menampilkan data
app.get('/evaluations', (req, res) => {
    let sql = 'SELECT * FROM evaluations';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route untuk menyimpan data
app.post('/add-evaluation', (req, res) => {
    let evaluation = req.body;
    let sql = 'INSERT INTO evaluations SET ?';

    // Tambahkan kolom untuk setiap skor
    evaluation.score1 = evaluation.scores[0];
    evaluation.score2 = evaluation.scores[1];
    evaluation.score3 = evaluation.scores[2];
    evaluation.score4 = evaluation.scores[3];
    evaluation.score5 = evaluation.scores[4];
    evaluation.score6 = evaluation.scores[5];
    evaluation.score7 = evaluation.scores[6];
    evaluation.score8 = evaluation.scores[7];
    evaluation.score9 = evaluation.scores[8];

    // Hitung total skor
    evaluation.totalScore = evaluation.score1 + evaluation.score2 + evaluation.score3 + 
                            evaluation.score4 + evaluation.score5 + evaluation.score6 + 
                            evaluation.score7 + evaluation.score8 + evaluation.score9;

    delete evaluation.scores; // Hapus kolom scores dari objek evaluation

    db.query(sql, evaluation, (err, result) => {
        if (err) throw err;
        res.send('Evaluation added...');
    });
});

app.get('/api/evaluations', (req, res) => {
    const sql = 'SELECT * FROM evaluations'; // Ganti dengan query yang sesuai
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Pastikan data yang dikembalikan memiliki struktur yang benar
        res.json(results);
    });
});


app.delete('/api/evaluations/:id', (req, res) => {
    const evaluationId = req.params.id; // Ambil ID dari parameter URL
    const sql = 'DELETE FROM evaluations WHERE id = ?'; // Ganti dengan query yang sesuai

    db.query(sql, [evaluationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send(); // Kirim respons 204 No Content
    });
});

//Faker
app.post('/api/evaluations/bulk', (req, res) => {
    const evaluations = req.body; // Ambil data dari request body

    // Pastikan data yang diterima adalah array
    if (!Array.isArray(evaluations)) {
        return res.status(400).json({ error: 'Data harus berupa array' });
    }

    // Siapkan query untuk menyimpan data
    const sql = 'INSERT INTO evaluations (date, bidang, gender, education, position, instansi, kegiatan, tempat, narasumber, score1, score2, score3, score4, score5, score6, score7, score8, score9, kritik) VALUES ?';
    const values = evaluations.map(evaluation => [
        evaluation.date,
        evaluation.bidang,
        evaluation.gender,
        evaluation.education,
        evaluation.position,
        evaluation.instansi,
        evaluation.kegiatan,
        evaluation.tempat,
        evaluation.narasumber,
        ...evaluation.scores,
        evaluation.kritik
    ]);

    db.query(sql, [values], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil ditambahkan', results });
    });
});


// Jalankan server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
