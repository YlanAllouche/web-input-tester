export class GamepadHandler {
  // TODO: needs more test
  constructor(logger, statusCallback, deviceInfoCallback) {
    this.logger = logger;
    this.statusCallback = statusCallback;
    this.deviceInfoCallback = deviceInfoCallback;
    this.gamepadIndex = null;
    this.gamepadAnimationId = null;
    this.lastButtonStates = [];
    this.lastAxesStates = [];

    window.addEventListener("gamepadconnected", (e) => this.onConnected(e));
    window.addEventListener("gamepaddisconnected", (e) =>
      this.onDisconnected(e),
    );
  }

  onConnected(event) {
    this.gamepadIndex = event.gamepad.index;
    this.statusCallback(true, `Gamepad: ${event.gamepad.id}`);

    this.deviceInfoCallback(`
            <strong>Gamepad Device:</strong><br>
            ID: ${event.gamepad.id}<br>
            Buttons: ${event.gamepad.buttons.length}<br>
            Axes: ${event.gamepad.axes.length}
        `);

    this.logger.log(`Connected: ${event.gamepad.id}`);
    this.logger.log(
      `Buttons: ${event.gamepad.buttons.length}, Axes: ${event.gamepad.axes.length}`,
    );

    this.poll();
  }

  onDisconnected(event) {
    this.logger.log("Gamepad disconnected");
    this.gamepadIndex = null;
    if (this.gamepadAnimationId) {
      cancelAnimationFrame(this.gamepadAnimationId);
    }
    this.statusCallback(false, "No gamepad connected");
  }

  poll() {
    const gamepad = navigator.getGamepads()[this.gamepadIndex];

    if (gamepad) {
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed && !this.lastButtonStates[index]) {
          this.logger.log(
            `Button ${index} pressed (value: ${button.value.toFixed(2)})`,
          );
        }
        this.lastButtonStates[index] = button.pressed;
      });

      // TODO: Look into axes
      gamepad.axes.forEach((value, index) => {
        const lastValue = this.lastAxesStates[index] || 0;
        if (Math.abs(value - lastValue) > 0.1) {
          this.logger.log(`Axis ${index}: ${value.toFixed(2)}`);
          this.lastAxesStates[index] = value;
        }
      });
    }

    this.gamepadAnimationId = requestAnimationFrame(() => this.poll());
  }

  checkForGamepad() {
    const gamepads = navigator.getGamepads();
    if (gamepads[0] && this.gamepadIndex === null) {
      this.onConnected({ gamepad: gamepads[0] });
    }
  }
}
