@echo off
chcp 65001 >nul
title Публикация WebXR проекта на GitHub Pages
cls
echo ======================================================================
echo    ПУБЛИКАЦИЯ WEBXR ПРИЛОЖЕНИЯ «ЕРМАК» НА GITHUB PAGES
echo    Дисциплина: Моделирование виртуальной и дополненной реальности
echo    Кафедра ЦТИГ ДВГУПС
echo ======================================================================
echo.
echo Этот скрипт автоматически загрузит ваш проект в ваш репозиторий GitHub.
echo.
echo 1. Убедитесь, что вы создали новый ПУБЛИЧНЫЙ (Public) репозиторий на github.com
echo    Например: "station" или "ermak-3es5k"
echo.
echo 2. Скопируйте ссылку на репозиторий (например, https://github.com/USERNAME/station.git)
echo.

set /p REPO_URL="Вставьте ссылку на ваш GitHub репозиторий и нажмите Enter: "

if "%REPO_URL%"=="" (
    echo.
    echo [ОШИБКА] Ссылка не была введена. Попробуйте снова.
    pause
    exit /b
)

echo.
echo [1/3] Настройка удаленного репозитория origin...
git config safe.directory *
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Добавление файлов и создание коммита...
git add .
git commit -m "Deploy WebXR 3D Locomotive to GitHub Pages" 2>nul
git branch -M main

echo [3/3] Отправка на GitHub (git push)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo [УСПЕХ!] Файлы успешно загружены в ваш репозиторий GitHub!
    echo.
    echo ТЕПЕРЬ ВКЛЮЧИТЕ GITHUB PAGES:
    echo 1. Откройте ваш репозиторий в браузере
    echo 2. Перейдите во вкладку Settings (Настройки) -> Pages (слева в меню)
    echo 3. В разделе "Build and deployment" -> "Branch" выберите ветку "main" и папку "/ (root)"
    echo 4. Нажмите кнопку "Save" (Сохранить)
    echo.
    echo Через 1-2 минуты ваше AR-приложение будет доступно по адресам:
    echo   https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/index.html
    echo   https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/webxr_app/index.html
    echo.
    echo Вы сможете открыть его со смартфона и просматривать модель в дополненной реальности!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo [ВНИМАНИЕ] Произошла ошибка при отправке (git push).
    echo Возможные причины:
    echo 1. Требуется авторизация в GitHub (введите логин и токен / Personal Access Token).
    echo 2. Репозиторий еще не создан на github.com или указана неверная ссылка.
    echo.
    echo Альтернативный способ: вы можете просто открыть github.com в браузере,
    echo открыть ваш репозиторий, нажать "Upload files" и перетащить все файлы
    echo из этой папки мышкой.
    echo ======================================================================
)

echo.
pause
