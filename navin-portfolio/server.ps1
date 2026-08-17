$port = 3000
$dbFile = Join-Path (Get-Location) "db.json"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Portfolio REST API & Web Server active at http://localhost:$port/"
} catch {
    Write-Host "Failed to start server on port $port : $_"
    exit 1
}

function Get-DbData {
    if (Test-Path $dbFile) {
        $json = Get-Content $dbFile -Raw -Encoding UTF8
        return ConvertFrom-Json $json
    }
    return @{ portfolio = @{}; projects = @(); certificates = @() }
}

function Save-DbData ($data) {
    $json = ConvertTo-Json $data -Depth 10
    Set-Content $dbFile $json -Encoding UTF8
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $method = $request.HttpMethod
    $localPath = $request.Url.LocalPath

    # CORS Headers
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if ($method -eq "OPTIONS") {
        $response.StatusCode = 200
        $response.Close()
        continue
    }

    # REST API Routing
    if ($localPath.StartsWith("/api/")) {
        $response.ContentType = "application/json; charset=utf-8"
        $db = Get-DbData

        # GET /api/db (Full state)
        if ($localPath -eq "/api/db" -and $method -eq "GET") {
            $jsonOut = ConvertTo-Json $db -Depth 10
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # GET /api/projects
        elseif ($localPath -eq "/api/projects" -and $method -eq "GET") {
            $jsonOut = ConvertTo-Json $db.projects -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # PUT /api/projects (Update all projects)
        elseif ($localPath -eq "/api/projects" -and $method -eq "PUT") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $db.projects = ConvertFrom-Json $body
            Save-DbData $db
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Projects updated successfully"}')
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # GET /api/certificates
        elseif ($localPath -eq "/api/certificates" -and $method -eq "GET") {
            $jsonOut = ConvertTo-Json $db.certificates -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # PUT /api/certificates (Update all certificates)
        elseif ($localPath -eq "/api/certificates" -and $method -eq "PUT") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $db.certificates = ConvertFrom-Json $body
            Save-DbData $db
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Certificates updated successfully"}')
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # GET /api/portfolio
        elseif ($localPath -eq "/api/portfolio" -and $method -eq "GET") {
            $jsonOut = ConvertTo-Json $db.portfolio -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # PUT /api/portfolio
        elseif ($localPath -eq "/api/portfolio" -and $method -eq "PUT") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $db.portfolio = ConvertFrom-Json $body
            Save-DbData $db
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Portfolio updated successfully"}')
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # POST /api/login
        elseif ($localPath -eq "/api/login" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $credentials = ConvertFrom-Json $body
            if ($credentials.password -eq "12345" -or $credentials.password -eq "1234" -or ($credentials.username -eq "admin" -and $credentials.password -eq "12345")) {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"token":"admin-session-active"}')
            } else {
                $response.StatusCode = 401
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":false,"error":"Invalid credentials"}')
            }
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Endpoint not found"}')
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.Close()
        continue
    }

    # Static File Routing
    if ($localPath -eq "/admin" -or $localPath -eq "/admin/" -or $localPath -eq "/backend" -or $localPath -eq "/backend/") { 
        $localPath = "/admin.html" 
    } elseif ($localPath -eq "/") { 
        $localPath = "/index.html" 
    }
    
    $filePath = Join-Path (Get-Location) $localPath.TrimStart('/')

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css; charset=utf-8" }
            ".js"   { $response.ContentType = "text/javascript; charset=utf-8" }
            ".json" { $response.ContentType = "application/json; charset=utf-8" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            ".png"  { $response.ContentType = "image/png" }
            ".jpg"  { 
                try {
                    $txt = [System.Text.Encoding]::UTF8.GetString($bytes)
                    if ($txt.Trim().StartsWith("<svg")) {
                        $response.ContentType = "image/svg+xml"
                    } else {
                        $response.ContentType = "image/jpeg"
                    }
                } catch {
                    $response.ContentType = "image/jpeg"
                }
            }
            default { $response.ContentType = "text/plain" }
        }

        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 File Not Found</h1>")
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.Close()
}
