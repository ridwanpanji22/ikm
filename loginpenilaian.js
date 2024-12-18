document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Data login untuk admin
    const correctAdminUsername = 'admin';
    const correctAdminPassword = 'gokil123';

    // Data login untuk user biasa
    const correctUserUsername = 'user';
    const correctUserPassword = 'keren123';

    if (username === correctAdminUsername && password === correctAdminPassword) {
        // Arahkan ke dashboard admin jika login sebagai admin
        window.location.href = 'hasilpenilaian.html'; 
    } else if (username === correctUserUsername && password === correctUserPassword) {
        // Arahkan ke halaman user biasa jika login sebagai user biasa
        window.location.href = 'penginputan.html'; 
    } else {
        alert('Username atau password salah!');
    }
});
