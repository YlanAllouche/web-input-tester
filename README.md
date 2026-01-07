
# Web intput tester

A quick utility to double check the key codes and modifies for common input devices using WebAPI's.

## Features

- Keyboard/HID/Gamepad support usingWebAPI's
- Shows modifiers alt/meta/control/shift
- Shows keycode
- Displays connected device details

## Usage

1. Open `index.html` locally or `https://ylanallouche.github.io/web-input-tester/` in a web browser
2. Select your input type from the tabs (HID, Gamepad, or Keyboard)
3. For HID: Click "Connect HID Device" to select a USB device
4. Monitor incoming input events in the log panel
5. Use "Clear Log" to reset the display

## Project Structure

```
src/
  ├── app.js                 # Entrypoint 
  ├── handlers/              # Handlers
  │   ├── hidHandler.js      # HID device 
  │   ├── gamepadHandler.js  # Gamepad API 
  │   └── keyboardHandler.js # Keyboard event 
  └── utils/
      └── logger.js          # Shared logging utility
css/
  └── style.css              
index.html                    # Invoking 
```

## Browser Support

Requires a modern browser with support for:
- WebHID API (for USB device support)
- Gamepad API
- ES6 modules

## License

MIT © 2026 ALLOUCHE Ylan
