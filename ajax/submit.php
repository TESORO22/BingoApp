<?php
// POSTデータを取得
$name = $_POST['name'];
$score = $_POST['score'];

// ファイルに保存（JSONとして）
$file = 'scores.json';
$data = [];

if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
}

$data[] = ['name' => $name, 'score' => (float)$score];

// スコア昇順にソート（小さいほど上位）
usort($data, fn($a, $b) => $a['score'] <=> $b['score']);

// JSONファイルに保存
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

// レスポンス
header('Content-Type: application/json');
echo json_encode(['status' => 'ok', 'message' => '保存完了']);
?>
