<?php
header("Content-Type: application/json");
$supabaseUrl = 'https://qomhhffaetgwjvifgcai.supabase.co/rest/v1/course_created';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbWhoZmZhZXRnd2p2aWZnY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzY2NjQsImV4cCI6MjA4NjgxMjY2NH0.4Uf9enXmwlMEGZez8E9tNOzfh9AA74qcTUz15yfz1lQ';

$method = $_SERVER['REQUEST_METHOD'];
$input = file_get_contents('php://input');

$headers = [
    'apikey: ' . $supabaseKey,
    'Authorization: Bearer ' . $supabaseKey,
    'Content-Type: application/json',
    'Prefer: return=representation'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

if ($method === 'POST') {
    // Create or Update (if ID is present)
    curl_setopt($ch, CURLOPT_URL, $supabaseUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
} elseif ($method === 'GET') {
    curl_setopt($ch, CURLOPT_URL, $supabaseUrl . '?select=*&order=created_at.desc');
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    curl_setopt($ch, CURLOPT_URL, $supabaseUrl . '?id=eq.' . $id);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
}

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>