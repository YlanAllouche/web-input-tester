export class KeyboardHandler {
    constructor(logger) {
        this.logger = logger;

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onKeyDown(event) {
        this.logger.log(`Key: "${event.key}" | Code: "${event.code}" | KeyCode: ${event.keyCode}`, {
            key: event.key,
            code: event.code,
            keyCode: event.keyCode,
            which: event.which,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey
        });
    }
}
