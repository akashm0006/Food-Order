$ErrorActionPreference = 'Stop'

Write-Host "=== TEST 1: Health Check ==="
$h = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/health" -Method Get
Write-Host "API Status: $($h.status)"

Write-Host "`n=== TEST 2: Customer Login ==="
$custLogin = @{ email = "customer@foodhub.com"; password = "customer123" } | ConvertTo-Json
$custRes = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/auth/login" -Method Post -Body $custLogin -ContentType "application/json"
$custToken = $custRes.token
Write-Host "Customer logged in: $($custRes.user.name)"

Write-Host "`n=== TEST 3: Admin Login ==="
$adminLogin = @{ email = "admin@foodhub.com"; password = "admin123" } | ConvertTo-Json
$adminRes = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
$adminToken = $adminRes.token
Write-Host "Admin logged in: $($adminRes.user.name)"

Write-Host "`n=== TEST 4: Get Foods ==="
$foodsRes = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/food" -Method Get
Write-Host "Total food items returned: $($foodsRes.count)"
$item1 = $foodsRes.foods[0]
$item2 = $foodsRes.foods[1]
Write-Host "Item 1: $($item1.name) (Rs. $($item1.price))"

Write-Host "`n=== TEST 5: Customer Place Order ==="
$orderPayload = @{
    items = @(
        @{ foodId = $item1._id; name = $item1.name; price = $item1.price; quantity = 2; image = $item1.image },
        @{ foodId = $item2._id; name = $item2.name; price = $item2.price; quantity = 1; image = $item2.image }
    );
    deliveryAddress = @{
        fullName = "Aarav Sharma";
        phone = "+91 98123 45678";
        street = "Flat 304, Green Heights, Rose Avenue";
        city = "Metro City";
        pincode = "110001";
        notes = "Deliver before 8 PM";
    };
    paymentMethod = "Cash on Delivery";
} | ConvertTo-Json -Depth 5

$newOrder = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/orders" -Method Post -Body $orderPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $custToken" }
$orderId = $newOrder.order._id
Write-Host "Order placed successfully! ID: $orderId, Status: $($newOrder.order.status), Total: Rs. $($newOrder.order.totalAmount)"

Write-Host "`n=== TEST 6: Customer View Order Tracking ==="
$trackedOrder = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/orders/$orderId" -Method Get -Headers @{ Authorization = "Bearer $custToken" }
Write-Host "Customer Order Status: $($trackedOrder.order.status)"
Write-Host "Timeline entries count: $($trackedOrder.order.statusHistory.Count)"

Write-Host "`n=== TEST 7: Admin Updates Order to 'Preparing' then 'Out for Delivery' ==="
$update1 = @{ status = "Preparing"; note = "Chef has started cooking" } | ConvertTo-Json
$uRes1 = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/orders/$orderId/status" -Method Patch -Body $update1 -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Status after update 1: $($uRes1.order.status)"

$update2 = @{ status = "Out for Delivery"; note = "Delivery partner picked up parcel" } | ConvertTo-Json
$uRes2 = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/orders/$orderId/status" -Method Patch -Body $update2 -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Status after update 2: $($uRes2.order.status)"

Write-Host "`n=== TEST 8: Admin Dashboard Statistics ==="
$statsRes = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/orders/stats" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Admin Stats Total Revenue: Rs. $($statsRes.stats.totalRevenue)"
Write-Host "Admin Stats Total Orders: $($statsRes.stats.totalOrders)"
Write-Host "Admin Stats Active Pending Orders: $($statsRes.stats.pendingOrders)"

Write-Host "`n=== TEST 9: Admin Toggles Food Availability ==="
$toggleRes = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/food/$($item1._id)/availability" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Item 1 availability toggled to: $($toggleRes.isAvailable)"
$toggleBack = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/food/$($item1._id)/availability" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Item 1 restored to: $($toggleBack.isAvailable)"

Write-Host "`n>>> ALL 9 INTEGRATION & LIFECYCLE TESTS PASSED 100% SUCCESSFULLY! <<<"
