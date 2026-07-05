Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName Microsoft.VisualBasic

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$gitCandidates = @(
  (Join-Path $repo "..\..\tools\mingit-2.55.0.2\cmd\git.exe"),
  "git.exe"
)

$git = $null
foreach ($candidate in $gitCandidates) {
  try {
    if ($candidate -eq "git.exe") {
      $cmd = Get-Command git.exe -ErrorAction SilentlyContinue
      if ($cmd) { $git = $cmd.Source; break }
    } else {
      $resolved = Resolve-Path $candidate -ErrorAction SilentlyContinue
      if ($resolved) { $git = $resolved.Path; break }
    }
  } catch {}
}

if (-not $git) {
  [System.Windows.Forms.MessageBox]::Show("没有找到 Git。请先确认 E:\codex\tools\mingit-2.55.0.2 是否存在。", "存档管理器", "OK", "Error") | Out-Null
  exit 1
}

function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  $output = & $git -C $repo @Args 2>&1
  return ($output -join [Environment]::NewLine)
}

function Get-Commits {
  $log = Invoke-Git log --date=format:"%Y-%m-%d %H:%M" --pretty=format:"%h`t%ad`t%s" -n 80
  if (-not $log) { return @() }
  return $log -split "`r?`n" | Where-Object { $_.Trim() } | ForEach-Object {
    $parts = $_ -split "`t", 3
    [PSCustomObject]@{
      Id = $parts[0]
      Time = $parts[1]
      Message = $parts[2]
    }
  }
}

function Get-StatusText {
  $status = Invoke-Git status --short
  if ($status.Trim()) { return $status }
  return "当前没有未保存修改。"
}

function Refresh-Ui {
  $commitList.Items.Clear()
  foreach ($commit in Get-Commits) {
    $item = New-Object System.Windows.Forms.ListViewItem($commit.Id)
    [void]$item.SubItems.Add($commit.Time)
    [void]$item.SubItems.Add($commit.Message)
    $item.Tag = $commit
    [void]$commitList.Items.Add($item)
  }
  $statusBox.Text = Get-StatusText
}

function Create-Checkpoint {
  $message = [Microsoft.VisualBasic.Interaction]::InputBox(
    "给这次存档起个名字，例如：调整电视玻璃质感",
    "创建存档",
    "checkpoint: "
  )

  if (-not $message.Trim()) { return }

  try {
    Invoke-Git add . | Out-Null
    $commitResult = Invoke-Git commit -m $message
    if ($commitResult -match "nothing to commit|无文件要提交") {
      [System.Windows.Forms.MessageBox]::Show("现在没有新的修改需要存档。", "创建存档", "OK", "Information") | Out-Null
    } else {
      [System.Windows.Forms.MessageBox]::Show("存档完成。", "创建存档", "OK", "Information") | Out-Null
    }
  } catch {
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "创建存档失败", "OK", "Error") | Out-Null
  }
  Refresh-Ui
}

function Restore-Selected {
  if ($commitList.SelectedItems.Count -eq 0) {
    [System.Windows.Forms.MessageBox]::Show("请先选中一个存档。", "回退存档", "OK", "Information") | Out-Null
    return
  }

  $commit = $commitList.SelectedItems[0].Tag
  $message = "要回退到这个存档吗？`n`n$($commit.Id)  $($commit.Time)`n$($commit.Message)`n`n注意：当前未保存的修改会被覆盖。"
  $answer = [System.Windows.Forms.MessageBox]::Show($message, "回退存档", "YesNo", "Warning")
  if ($answer -ne [System.Windows.Forms.DialogResult]::Yes) { return }

  try {
    Invoke-Git reset --hard $commit.Id | Out-Null
    [System.Windows.Forms.MessageBox]::Show("已经回退到选中的存档。", "回退存档", "OK", "Information") | Out-Null
  } catch {
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "回退失败", "OK", "Error") | Out-Null
  }
  Refresh-Ui
}

function Show-Selected-Detail {
  if ($commitList.SelectedItems.Count -eq 0) { return }
  $commit = $commitList.SelectedItems[0].Tag
  $detailBox.Text = Invoke-Git show --stat --oneline --decorate --summary $commit.Id
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "画画的 o 泡 - 存档管理器"
$form.Size = New-Object System.Drawing.Size(1060, 700)
$form.StartPosition = "CenterScreen"
$form.MinimumSize = New-Object System.Drawing.Size(920, 560)
$form.BackColor = [System.Drawing.Color]::FromArgb(24, 22, 19)
$form.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$form.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 10)

$title = New-Object System.Windows.Forms.Label
$title.Text = "画画的 o 泡  /  Git 存档"
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(22, 18)
$title.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 18, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($title)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "像游戏存档一样保存当前网页版本，也可以回到某一次存档。"
$subtitle.AutoSize = $true
$subtitle.Location = New-Object System.Drawing.Point(25, 56)
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(180, 166, 139)
$form.Controls.Add($subtitle)

$createButton = New-Object System.Windows.Forms.Button
$createButton.Text = "创建存档"
$createButton.Location = New-Object System.Drawing.Point(24, 96)
$createButton.Size = New-Object System.Drawing.Size(130, 38)
$createButton.BackColor = [System.Drawing.Color]::FromArgb(214, 178, 119)
$createButton.ForeColor = [System.Drawing.Color]::FromArgb(22, 17, 13)
$createButton.FlatStyle = "Flat"
$createButton.Add_Click({ Create-Checkpoint })
$form.Controls.Add($createButton)

$restoreButton = New-Object System.Windows.Forms.Button
$restoreButton.Text = "回退到选中存档"
$restoreButton.Location = New-Object System.Drawing.Point(168, 96)
$restoreButton.Size = New-Object System.Drawing.Size(170, 38)
$restoreButton.BackColor = [System.Drawing.Color]::FromArgb(58, 47, 39)
$restoreButton.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$restoreButton.FlatStyle = "Flat"
$restoreButton.Add_Click({ Restore-Selected })
$form.Controls.Add($restoreButton)

$refreshButton = New-Object System.Windows.Forms.Button
$refreshButton.Text = "刷新"
$refreshButton.Location = New-Object System.Drawing.Point(352, 96)
$refreshButton.Size = New-Object System.Drawing.Size(92, 38)
$refreshButton.BackColor = [System.Drawing.Color]::FromArgb(58, 47, 39)
$refreshButton.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$refreshButton.FlatStyle = "Flat"
$refreshButton.Add_Click({ Refresh-Ui })
$form.Controls.Add($refreshButton)

$commitList = New-Object System.Windows.Forms.ListView
$commitList.Location = New-Object System.Drawing.Point(24, 152)
$commitList.Size = New-Object System.Drawing.Size(610, 470)
$commitList.View = "Details"
$commitList.FullRowSelect = $true
$commitList.HideSelection = $false
$commitList.BackColor = [System.Drawing.Color]::FromArgb(31, 29, 25)
$commitList.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$commitList.GridLines = $true
[void]$commitList.Columns.Add("版本", 90)
[void]$commitList.Columns.Add("时间", 150)
[void]$commitList.Columns.Add("存档说明", 340)
$commitList.Add_SelectedIndexChanged({ Show-Selected-Detail })
$form.Controls.Add($commitList)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "当前未保存修改"
$statusLabel.AutoSize = $true
$statusLabel.Location = New-Object System.Drawing.Point(656, 98)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(214, 178, 119)
$form.Controls.Add($statusLabel)

$statusBox = New-Object System.Windows.Forms.TextBox
$statusBox.Location = New-Object System.Drawing.Point(656, 122)
$statusBox.Size = New-Object System.Drawing.Size(360, 146)
$statusBox.Multiline = $true
$statusBox.ReadOnly = $true
$statusBox.ScrollBars = "Vertical"
$statusBox.BackColor = [System.Drawing.Color]::FromArgb(31, 29, 25)
$statusBox.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$form.Controls.Add($statusBox)

$detailLabel = New-Object System.Windows.Forms.Label
$detailLabel.Text = "选中存档详情"
$detailLabel.AutoSize = $true
$detailLabel.Location = New-Object System.Drawing.Point(656, 288)
$detailLabel.ForeColor = [System.Drawing.Color]::FromArgb(214, 178, 119)
$form.Controls.Add($detailLabel)

$detailBox = New-Object System.Windows.Forms.TextBox
$detailBox.Location = New-Object System.Drawing.Point(656, 312)
$detailBox.Size = New-Object System.Drawing.Size(360, 310)
$detailBox.Multiline = $true
$detailBox.ReadOnly = $true
$detailBox.ScrollBars = "Vertical"
$detailBox.BackColor = [System.Drawing.Color]::FromArgb(31, 29, 25)
$detailBox.ForeColor = [System.Drawing.Color]::FromArgb(237, 224, 199)
$detailBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$form.Controls.Add($detailBox)

$form.Add_Shown({ Refresh-Ui })
[void]$form.ShowDialog()

