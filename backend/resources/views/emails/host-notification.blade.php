<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Visitor Check-In</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h2>New Visitor Has Arrived</h2>

    <p><strong>Name:</strong> {{ $visit->visitor->full_name }}</p>
    <p><strong>Company:</strong> {{ $visit->visitor->company ?? '-' }}</p>
    <p><strong>Phone:</strong> {{ $visit->visitor->phone }}</p>
    <p><strong>Check-in Time:</strong> {{ $visit->check_in_at }}</p>
    <p><strong>Purpose:</strong> {{ $visit->purpose ?? '-' }}</p>

    @if($photoData)
        <p><strong>Visitor Photo:</strong></p>
        <img src="{{ $photoData }}"
             alt="Visitor Photo"
             width="200"
             style="border-radius:8px; border:1px solid #ddd;" />
    @endif

    <p>Please meet your visitor at the lobby.</p>

    <br>
    <small>Visitor Kiosk System</small>
</body>
</html>
