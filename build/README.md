# Electron Build Resources

Поместите сюда иконки приложения:

- `icon.ico` - для Windows (256x256)
- `icon.icns` - для macOS (512x512)
- `icon.png` - для Linux (512x512)

## Создание иконок:

Вы можете использовать онлайн сервисы для конвертации изображений в нужные форматы:
- https://www.icoconverter.com/ - для .ico
- https://cloudconvert.com/png-to-icns - для .icns

Или использовать electron-icon-builder:
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./build
```
