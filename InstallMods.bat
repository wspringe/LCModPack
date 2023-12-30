@ECHO OFF
TITLE Installing mod files
setlocal ENABLEEXTENSIONS
setlocal ENABLEDELAYEDEXPANSION

set KEY_NAME="HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Valve\Steam"
set VALUE_NAME=InstallPath

FOR /F "tokens=2* skip=2" %%a in ('reg query "%KEY_NAME%" /v "%VALUE_NAME%"') do (
   set InstallPath=%%b
   @echo Steam installation path: !InstallPath!
)

if not exist !InstallPath! (
    @echo Could not find the steam install path
    PAUSE
    EXIT
)

set LibraryFilePath="!InstallPath!\steamapps\"
pushd !LibraryFilePath!

if not exist libraryfolders.vdf (
    @echo Could not find the libraryfolders.vdf file
    PAUSE
    EXIT
)

@echo Checking the libraryfolders.vdf file for your steam game install path(s)...
FOR /F "usebackq tokens=1* delims=		" %%a IN ("libraryfolders.vdf") DO (
    echo %%a|find "path" > nul
    if not errorlevel 1 (
       set SteamGamesPath=%%b
       @echo Found steam games install folder: !SteamGamesPath!

       if exist "!SteamGamesPath!\steamapps\common\Lethal Company\" (
        @echo Found the lethal company install path: !SteamGamesPAth!\steamapps\common\Lethal Company\
         set LethalCompanyInstallPath="!SteamGamesPath!\steamapps\common\Lethal Company\"
       )
    )
)

if not exist !LethalCompanyInstallPath! (
    @echo Could not find the lethal company install path
    PAUSE
    EXIT
)

popd

if exist !LethalCompanyInstallPath! (
    @echo Copying the plugins and config folders
    if exist "%cd%\plugins" xcopy "%cd%\plugins\" !LethalCompanyInstallPath!\BepInEx\plugins\ /E /C /I /Y
    if exist "%cd%\cats" xcopy "%cd%\cats\" !LethalCompanyInstallPath!\BepInEx\plugins\ /E /C /I /Y
    if exist "%cd%\config\" xcopy "%cd%\config\" !LethalCompanyInstallPath!\BepInEx\config\ /E /C /I /Y
) else (
    @echo Did not find an install path for Lethal Company
    PAUSE
)
