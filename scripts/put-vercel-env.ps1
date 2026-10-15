# Push selected secrets from local .env to the linked Vercel project.
# Usage:
#   1. Put VERCEL_TOKEN=... in .env  (gitignored)
#   2. pnpm secrets:put
#
# Detects link via .vercel/project.json OR .vercel/repo.json (CLI v64+).

param(
	# Comma-separated or array. Prefer: -Keys "A,B,C" when calling via nested pwsh.
	[string[]]$Keys = @(
		'API_JWT_PRIVATE_KEY',
		'API_URL',
		'STUDIO_SECRET',
		'AMAP_KEY',
		'MAPBOX_TOKEN'
	),
	[string]$Environments = 'production,preview',
	[switch]$IncludeLegacyApiSecret,
	[switch]$LinkOnly
)

# Flatten "A,B,C" → @('A','B','C') (nested pwsh often breaks -Keys arrays).
$Keys = @($Keys | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env'
$vercelDir = Join-Path $root '.vercel'
$projectJson = Join-Path $vercelDir 'project.json'
$repoJson = Join-Path $vercelDir 'repo.json'

# Prefer D: for npm cache when C: is tight (ENOSPC on npx).
$npmCache = Join-Path $root '.npm-cache'
if (-not (Test-Path $npmCache)) {
	New-Item -ItemType Directory -Path $npmCache | Out-Null
}
$env:npm_config_cache = $npmCache

if (-not (Test-Path $envFile)) {
	Write-Error "Missing .env — copy .env.example and fill values."
}

function Get-DotEnvValue([string]$path, [string]$key) {
	$line = Get-Content $path | Where-Object {
		$_ -match ("^\s*" + [regex]::Escape($key) + "\s*=")
	} | Select-Object -First 1
	if (-not $line) { return $null }
	$idx = $line.IndexOf('=')
	return $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
}

function Get-LinkedProject {
	if (Test-Path $projectJson) {
		$p = Get-Content $projectJson -Raw | ConvertFrom-Json
		return [pscustomobject]@{
			ProjectId = $p.projectId
			ProjectName = $null
			OrgId = $p.orgId
		}
	}
	if (Test-Path $repoJson) {
		$r = Get-Content $repoJson -Raw | ConvertFrom-Json
		$proj = $r.projects | Select-Object -First 1
		if (-not $proj) { return $null }
		return [pscustomobject]@{
			ProjectId = $proj.id
			ProjectName = $proj.name
			OrgId = $proj.orgId
		}
	}
	return $null
}

function Invoke-Vercel([string[]]$VercelArgs) {
	$cmd = Get-Command vercel -ErrorAction SilentlyContinue
	if ($cmd) {
		& vercel @VercelArgs
		return $LASTEXITCODE
	}
	& npx --yes vercel @VercelArgs
	return $LASTEXITCODE
}

$token = $env:VERCEL_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
	$token = Get-DotEnvValue $envFile 'VERCEL_TOKEN'
}
if ([string]::IsNullOrWhiteSpace($token)) {
	Write-Error @"
Missing VERCEL_TOKEN.

Add to .env (gitignored):

  VERCEL_TOKEN=vercel_xxxxxxxx

Create token: https://vercel.com/account/tokens
"@
}

$env:VERCEL_TOKEN = $token

$linked = Get-LinkedProject
if (-not $linked) {
	Write-Host "Project not linked. Running: vercel link --yes --project yuhang-ch ..."
	$code = Invoke-Vercel @(
		'link', '--yes', '--project', 'yuhang-ch', '--token', $token
	)
	$linked = Get-LinkedProject
	if ($code -ne 0 -or -not $linked) {
		Write-Error "vercel link failed. Try: npx vercel link --yes --project yuhang-ch --token `$env:VERCEL_TOKEN"
	}
}

$projectRef = if ($linked.ProjectName) { $linked.ProjectName } else { $linked.ProjectId }
Write-Host "Using Vercel project: $projectRef (org $($linked.OrgId))"

if ($LinkOnly) {
	Write-Host "Linked. Done."
	exit 0
}

if ($IncludeLegacyApiSecret) {
	$Keys = @($Keys) + @('API_SECRET')
}

foreach ($name in $Keys) {
	$value = Get-DotEnvValue $envFile $name
	if ([string]::IsNullOrWhiteSpace($value)) {
		Write-Host "Skipping empty $name"
		continue
	}

	# Pass value on stdin — PEM one-liners break --value argv parsing.
	$cliArgs = @(
		'env', 'add', $name, $Environments,
		'--force',
		'--yes',
		'--project', $projectRef,
		'--token', $token
	)
	if ($linked.OrgId) {
		$cliArgs += @('--scope', $linked.OrgId)
	}
	if (@('API_JWT_PRIVATE_KEY', 'STUDIO_SECRET', 'AMAP_KEY', 'API_SECRET') -contains $name) {
		$cliArgs += '--sensitive'
	}

	Write-Host "Upserting $name → $Environments ..."
	$cmd = Get-Command vercel -ErrorAction SilentlyContinue
	if ($cmd) {
		$value | & vercel @cliArgs
	} else {
		$value | & npx --yes vercel @cliArgs
	}
	if ($LASTEXITCODE -ne 0) {
		Write-Error "Failed to set $name (exit $LASTEXITCODE). If ENOSPC: free space on C:, or clear npm cache."
	}
}

Write-Host "Done. Redeploy so env takes effect."
