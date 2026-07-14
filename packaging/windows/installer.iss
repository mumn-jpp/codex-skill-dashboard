#define AppName "Codex Skill Dashboard"
#define AppVersion "0.1.0"
[Setup]
AppId={{9A42C108-E92C-4D90-A124-EFAE56E94DF8}
AppName={#AppName}
AppVersion={#AppVersion}
DefaultDirName={localappdata}\Programs\CodexSkillDashboard
PrivilegesRequired=lowest
OutputBaseFilename=Codex-Skill-Dashboard-Setup-{#AppVersion}-unsigned
OutputDir=..\..\dist
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
SetupIconFile=..\..\build\generated-icons\app.ico
UninstallDisplayIcon={app}\codex-skill-dashboard.exe
[Files]
Source: "..\..\dist\codex-skill-dashboard.exe"; DestDir: "{app}"; Flags: ignoreversion
[Icons]
Name: "{group}\Codex Skill Dashboard"; Filename: "{app}\codex-skill-dashboard.exe"
Name: "{autodesktop}\Codex Skill Dashboard"; Filename: "{app}\codex-skill-dashboard.exe"; Tasks: desktopicon
[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; Flags: unchecked
[Run]
Filename: "{app}\codex-skill-dashboard.exe"; Description: "Launch Codex Skill Dashboard"; Flags: nowait postinstall skipifsilent
