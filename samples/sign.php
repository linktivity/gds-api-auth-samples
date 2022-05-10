<?php

$salt1 = '_';
$salt2 = '_';

function getSignature($endpoint, $path, $api_key, $timestamp)
{
    global $salt1, $salt2;
    $k1 = hash_hmac('sha256', $timestamp, $salt1 . $api_key, true);
    $k2 = hash_hmac('sha256', $endpoint, $k1, true);
    $k3 = hash_hmac('sha256', $path, $k2, true);
    $k = hash_hmac('sha256', $salt2, $k3, true);
    return str_replace(['+', '/'], ['-', '_'], base64_encode($k));
}
