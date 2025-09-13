"" | Out-File -Encoding UTF8 build/env.js
"window._ENV={" | Out-File -Append -Encoding UTF8 build/env.js
Get-ChildItem env: | Where-Object { $_.Name -like "REACT_APP_*" } | ForEach-Object {
    "$($_.Name):'$($_.Value)'," | Out-File -Append -Encoding UTF8 build/env.js
}
"}" | Out-File -Append -Encoding UTF8 build/env.js