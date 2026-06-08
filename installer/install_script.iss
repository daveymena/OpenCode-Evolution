; OpenCode Evolution - Windows Installer
; Inno Setup Script
; Requiere Inno Setup: https://jrsoftware.org/isdl.php

#define MyAppName "OpenCode Evolution"
#define MyAppShortName "OpenCode"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "OpenCode Evolution"
#define MyAppURL "https://github.com/daveymena/OpenCode-Evolution"
#define MyAppExeName "opencode.exe"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={localappdata}\{#MyAppShortName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\dist
OutputBaseFilename=OpenCode-Evolution-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
SetupIconFile=..\icon.ico
UninstallDisplayIcon={app}\icon.ico

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Messages]
spanish.WelcomeLabel2=Este instalador pondrá [name] en tu PC y lo conectará con tu servidor EasyPanel.
spanish.FinishedLabelNoIcons=La instalación se ha completado correctamente.
spanish.YesLabel=&Sí
spanish.NoLabel=&No

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el &Escritorio"; GroupDescription: "Accesos directos:"; Flags: checkablealone
Name: "startup"; Description: "Iniciar OpenCode al &iniciar sesión"; GroupDescription: "Inicio automático:"; Flags: checkablealone

[Files]
Source: "..\opencode.json"; DestDir: "{userappdata}\{#MyAppShortName}\config"; Flags: ignoreversion
Source: "..\opencode.json"; DestDir: "{userappdata}\{#MyAppShortName}\config"; DestName: "opencode.example.json"; Flags: ignoreversion
Source: "post-install.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "launch-easypanel.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "launch-local.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\icon.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName} (Web Local)"; Filename: "{app}\launch-local.bat"; IconFilename: "{app}\icon.ico"; WorkingDir: "{app}"
Name: "{group}\{#MyAppName} (EasyPanel Server)"; Filename: "{app}\launch-easypanel.bat"; IconFilename: "{app}\icon.ico"; WorkingDir: "{app}"
Name: "{group}\Desinstalar {#MyAppName}"; Filename: "{uninstallexe}"; IconFilename: "{app}\icon.ico"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\launch-local.bat"; IconFilename: "{app}\icon.ico"; WorkingDir: "{app}"; Tasks: desktopicon
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\launch-local.bat"; WorkingDir: "{app}"; Tasks: startup

[Run]
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\post-install.ps1"""; Flags: runhidden waituntilterminated; StatusMsg: "Instalando OpenCode CLI..."
Filename: "{app}\launch-local.bat"; Description: "Abrir OpenCode Local"; Flags: postinstall nowait skipifsilent shellexec; Tasks: desktopicon

[UninstallRun]
Filename: "cmd.exe"; Parameters: "/C npm uninstall -g opencode-ai"; Flags: runhidden waituntilterminated; RunOnceId: "UninstallOpenCodeCLI"
Filename: "powershell.exe"; Parameters: "-Command ""Remove-Item -Recurse -Force '$env:USERPROFILE\.config\opencode' -ErrorAction SilentlyContinue"""; Flags: runhidden; RunOnceId: "RemoveOpenCodeConfig"

[Code]
function NextButtonClick(CurPageID: Integer): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;

  if CurPageID = wpReady then
  begin
    if not Exec('powershell.exe', '-Command "try { node --version; exit 0 } catch { exit 1 }"', '',
       SW_HIDE, ewWaitUntilTerminated, ResultCode) or (ResultCode <> 0) then
    begin
      if MsgBox('Node.js no está instalado. ¿Descargar e instalar Node.js ahora?',
         mbConfirmation, MB_YESNO) = IDYES then
      begin
        Exec('powershell.exe', '-Command "Start-Process ''https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi''"', '',
          SW_SHOW, ewNoWait, ResultCode);
        MsgBox('Espera a que termine la instalación de Node.js y luego continúa.', mbInformation, MB_OK);
      end;
    end;
  end;
end;
