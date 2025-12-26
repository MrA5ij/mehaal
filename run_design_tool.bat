@echo off
echo ========================================
echo Mehaal Design Configuration Studio v2.0
echo Professional Design System Management
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo.
echo Starting Professional Design Studio...
echo Features: JSON Config, Undo/Redo, Presets, Live Preview
echo.

REM Run the Professional Studio
python design_config_studio.py

pause
