@ECHO OFF
TITLE Installing mod files
setlocal ENABLEEXTENSIONS
setlocal ENABLEDELAYEDEXPANSION

set KEY_NAME="HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Valve\Steam"
set VALUE_NAME=InstallPath

FOR /F "tokens=2* skip=2" %%a in ('reg query "%KEY_NAME%" /v "%VALUE_NAME%"') do (
   set InstallPath=%%b
   @echo InstallPath: !InstallPath!
)

set LibraryFilePath="!InstallPath!\steamapps\"
pushd !LibraryFilePath!

FOR /F "usebackq tokens=1* delims=		" %%a IN ("libraryfolders.vdf") DO (
    echo %%a|find "path" > nul
    if not errorlevel 1 (
       set SteamGamesPath=%%b
       @echo !SteamGamesPath!

       if exist "!SteamGamesPath!\steamapps\common\Lethal Company\" (
         set LethalCompanyInstallPath="!SteamGamesPath!\steamapps\common\Lethal Company\"
       )
    )
)
popd

if exist !LethalCompanyInstallPath! (
    @echo yep
    xcopy /s "%cd%\plugins\*.dll" !LethalCompanyInstallPath!\BepInEx\plugins\ /Y
    PAUSE
) else (
    @echo Did not find an install path for Lethal Company
    PAUSE
)
