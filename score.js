// ...

// Fungsi untuk menghitung nilai (score)
function calculateScore(evaluation) {
    var score = 0;
    for (var i = 0; i < evaluation.scores.length; i++) {
      score += parseInt(evaluation.scores[i]);
    }
    return score / evaluation.scores.length;
  }
  
  // Fungsi untuk menentukan rating (buruk, cukup, baik, sangat baik)
  function getRating(score) {
    if (score < 2) {
      return "Buruk";
    } else if (score < 4) {
      return "Cukup";
    } else if (score < 6) {
      return "Baik";
    } else {
      return "Sangat Baik";
    }
  }
  
  // ...
  
  // Tambahkan kolom untuk menampilkan nilai dan rating
  printDiv.innerHTML += '<th>Nilai</th><th>Rating</th>';
  
  // Looping untuk menambahkan data ke dalam tabel
  for (var i = 0; i < evaluations.length; i++) {
    var score = calculateScore(evaluations[i]);
    var rating = getRating(score);
    printDiv.innerHTML += '<tr><td>' + (i + 1) + '</td><td>' + evaluations[i].nama + '</td><td>' + evaluations[i].bidang + '</td><td>' + evaluations[i].tanggal + '</td><td>' + score.toFixed(2) + '</td><td>' + rating + '</td></tr>';
  }