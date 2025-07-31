<?php
/**
 * Тестовый скрипт для проверки загрузки изображений брендов
 * 
 * Использование:
 * 1. Разместите этот файл в корне проекта
 * 2. Запустите: php test_brand_image_upload.php
 * 3. Или откройте в браузере: https://your-domain.com/test_brand_image_upload.php
 */

// Настройки
$API_URL = 'https://shop4shoot.com/api/brand-images';
$JWT_TOKEN = 'your-jwt-token-here'; // Замените на реальный JWT токен

/**
 * Создание тестового base64 изображения (1x1 PNG)
 */
function createTestBase64Image(): string {
    // Минимальное PNG изображение 1x1 пиксель
    $pngData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    return 'data:image/png;base64,' . base64_encode($pngData);
}

/**
 * Отправка запроса к API
 */
function sendApiRequest(string $url, array $data, string $token, array $params = []): array {
    $fullUrl = $url;
    if (!empty($params)) {
        $fullUrl .= '?' . http_build_query($params);
    }
    
    $headers = [
        'Content-Type: application/json',
        'Authorization-Token: ' . $token
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $fullUrl,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("CURL Error: " . $error);
    }
    
    $decodedResponse = json_decode($response, true);
    
    return [
        'http_code' => $httpCode,
        'response' => $decodedResponse,
        'raw_response' => $response
    ];
}

/**
 * Форматирование результата для вывода
 */
function formatResult(array $result): string {
    $output = "HTTP Code: {$result['http_code']}\n";
    $output .= "Response:\n";
    $output .= json_encode($result['response'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return $output;
}

// Проверяем режим запуска
$isCliMode = php_sapi_name() === 'cli';

if ($isCliMode) {
    echo "=== Тест Brand Image Manager API ===\n\n";
} else {
    echo "<h1>Тест Brand Image Manager API</h1>";
    echo "<pre>";
}

try {
    $testImage = createTestBase64Image();
    
    // Тест 1: Тестовый режим (dry_run)
    if ($isCliMode) {
        echo "🧪 Тест 1: Тестовый режим (dry_run)\n";
        echo "═══════════════════════════════════\n";
    } else {
        echo "<h2>🧪 Тест 1: Тестовый режим (dry_run)</h2>\n";
    }
    
    $testData = [
        'brands' => [
            [
                'name' => 'GLOCK',
                'image' => $testImage
            ],
            [
                'name' => 'Beretta', 
                'image' => $testImage
            ],
            [
                'name' => 'test-unknown-brand',
                'image' => $testImage
            ]
        ]
    ];
    
    $result1 = sendApiRequest($API_URL, $testData, $JWT_TOKEN, ['dry_run' => 'Y']);
    echo formatResult($result1);
    
    if ($isCliMode) {
        echo "\n" . str_repeat("─", 60) . "\n\n";
    } else {
        echo "\n<hr>\n";
    }
    
    // Тест 2: Нечеткий поиск с пониженным порогом
    if ($isCliMode) {
        echo "🔍 Тест 2: Нечеткий поиск (similarity_threshold=0.6)\n";
        echo "══════════════════════════════════════════════════\n";
    } else {
        echo "<h2>🔍 Тест 2: Нечеткий поиск (similarity_threshold=0.6)</h2>\n";
    }
    
    $testData2 = [
        'brands' => [
            [
                'name' => 'glock', // строчными буквами
                'image' => $testImage
            ],
            [
                'name' => 'Glok', // с ошибкой в названии
                'image' => $testImage
            ]
        ]
    ];
    
    $result2 = sendApiRequest($API_URL, $testData2, $JWT_TOKEN, [
        'dry_run' => 'Y',
        'similarity_threshold' => '0.6'
    ]);
    echo formatResult($result2);
    
    if ($isCliMode) {
        echo "\n" . str_repeat("─", 60) . "\n\n";
    } else {
        echo "\n<hr>\n";
    }
    
    // Тест 3: Проверка валидации (ошибки)
    if ($isCliMode) {
        echo "❌ Тест 3: Проверка валидации (ошибки)\n";
        echo "════════════════════════════════════\n";
    } else {
        echo "<h2>❌ Тест 3: Проверка валидации (ошибки)</h2>\n";
    }
    
    $testData3 = [
        'brands' => [
            [
                'name' => '', // пустое название
                'image' => $testImage
            ]
        ]
    ];
    
    $result3 = sendApiRequest($API_URL, $testData3, $JWT_TOKEN, ['dry_run' => 'Y']);
    echo formatResult($result3);
    
    if ($isCliMode) {
        echo "\n" . str_repeat("─", 60) . "\n\n";
    } else {
        echo "\n<hr>\n";
    }
    
    // Тест 4: Неверный формат изображения
    if ($isCliMode) {
        echo "📷 Тест 4: Неверный формат изображения\n";
        echo "═══════════════════════════════════════\n";
    } else {
        echo "<h2>📷 Тест 4: Неверный формат изображения</h2>\n";
    }
    
    $testData4 = [
        'brands' => [
            [
                'name' => 'GLOCK',
                'image' => 'invalid-base64-data'
            ]
        ]
    ];
    
    $result4 = sendApiRequest($API_URL, $testData4, $JWT_TOKEN, ['dry_run' => 'Y']);
    echo formatResult($result4);
    
    if ($isCliMode) {
        echo "\n" . str_repeat("═", 60) . "\n";
        echo "✅ Тестирование завершено!\n";
    } else {
        echo "\n<hr>\n<h2>✅ Тестирование завершено!</h2>";
    }
    
} catch (Exception $e) {
    if ($isCliMode) {
        echo "❌ Ошибка: " . $e->getMessage() . "\n";
    } else {
        echo "<h2>❌ Ошибка:</h2>";
        echo "<p style='color: red;'>" . htmlspecialchars($e->getMessage()) . "</p>";
    }
}

if (!$isCliMode) {
    echo "</pre>";
    
    // Добавляем форму для ручного тестирования
    echo '
    <h2>🛠️ Ручное тестирование</h2>
    <form method="post" action="">
        <div style="margin-bottom: 10px;">
            <label for="brand_name">Название бренда:</label><br>
            <input type="text" id="brand_name" name="brand_name" value="GLOCK" style="width: 300px;">
        </div>
        
        <div style="margin-bottom: 10px;">
            <label for="image_file">Выберите изображение:</label><br>
            <input type="file" id="image_file" name="image_file" accept="image/png,image/jpeg,image/webp">
        </div>
        
        <div style="margin-bottom: 10px;">
            <label>
                <input type="checkbox" name="dry_run" value="Y" checked> Тестовый режим (dry_run)
            </label>
        </div>
        
        <div style="margin-bottom: 10px;">
            <label>
                <input type="checkbox" name="overwrite_existing" value="Y"> Перезаписывать существующие изображения
            </label>
        </div>
        
        <div style="margin-bottom: 10px;">
            <label for="similarity_threshold">Порог схожести:</label><br>
            <input type="number" id="similarity_threshold" name="similarity_threshold" value="0.8" min="0.1" max="1.0" step="0.1" style="width: 100px;">
        </div>
        
        <button type="submit" name="manual_test" style="padding: 10px 20px; background: #007cba; color: white; border: none; cursor: pointer;">
            Отправить тест
        </button>
    </form>';
    
    // Обработка ручного тестирования
    if (isset($_POST['manual_test']) && isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        echo '<h3>Результат ручного тестирования:</h3><pre>';
        
        try {
            $imageData = file_get_contents($_FILES['image_file']['tmp_name']);
            $imageType = $_FILES['image_file']['type'];
            $base64Image = 'data:' . $imageType . ';base64,' . base64_encode($imageData);
            
            $manualTestData = [
                'brands' => [
                    [
                        'name' => $_POST['brand_name'],
                        'image' => $base64Image
                    ]
                ]
            ];
            
            $params = [];
            if (isset($_POST['dry_run'])) $params['dry_run'] = 'Y';
            if (isset($_POST['overwrite_existing'])) $params['overwrite_existing'] = 'Y';
            if (!empty($_POST['similarity_threshold'])) $params['similarity_threshold'] = $_POST['similarity_threshold'];
            
            $manualResult = sendApiRequest($API_URL, $manualTestData, $JWT_TOKEN, $params);
            echo formatResult($manualResult);
            
        } catch (Exception $e) {
            echo "Ошибка: " . htmlspecialchars($e->getMessage());
        }
        
        echo '</pre>';
    }
    
    echo '
    <h2>📚 Полезная информация</h2>
    <ul>
        <li><strong>Endpoint:</strong> POST ' . $API_URL . '</li>
        <li><strong>Документация:</strong> <a href="/bitrix/docs/brand_image_manager_docs.md">brand_image_manager_docs.md</a></li>
        <li><strong>Поддерживаемые форматы:</strong> JPEG, PNG, WebP</li>
        <li><strong>Максимальный размер:</strong> 5MB (по умолчанию)</li>
        <li><strong>Максимум брендов за запрос:</strong> 100 (по умолчанию)</li>
    </ul>
    
    <h2>🔧 Настройка</h2>
    <p>Не забудьте изменить переменную <code>$JWT_TOKEN</code> в начале файла на ваш реальный JWT токен!</p>';
}
?> 