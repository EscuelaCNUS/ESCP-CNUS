Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = "c:\Users\emil-\Documents\CNUS\documentos\Documentacion - Articulando.docx"
try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $zip.Dispose()

        $xml = [xml]$content
        $nsManager = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $nsManager.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
        $textNodes = $xml.SelectNodes("//w:t", $nsManager)
        
        $text = @()
        foreach ($node in $textNodes) {
            $text += $node.InnerText
        }
        Write-Output ($text -join "`n")
    } else {
        Write-Output "word/document.xml not found"
        $zip.Dispose()
    }
} catch {
    Write-Error $_.Exception.Message
}
