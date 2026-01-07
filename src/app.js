import { Logger } from "./utils/logger.js";
import { HIDHandler } from "./handlers/hidHandler.js";
import { GamepadHandler } from "./handlers/gamepadHandler.js";
import { KeyboardHandler } from "./handlers/keyboardHandler.js";

class App {
  constructor() {
    this.currentTab = "hid";
    this.statusDiv = document.getElementById("status");
    this.deviceInfoDiv = document.getElementById("deviceInfo");

    this.hidLogger = new Logger("hid-log");
    this.gamepadLogger = new Logger("gamepad-log");
    this.keyboardLogger = new Logger("keyboard-log");

    this.hidHandler = new HIDHandler(
      this.hidLogger,
      (connected, message) => this.updateStatus(connected, message, "hid"),
      (info) => this.updateDeviceInfo(info),
    );

    this.gamepadHandler = new GamepadHandler(
      this.gamepadLogger,
      (connected, message) => this.updateStatus(connected, message, "gamepad"),
      (info) => this.updateDeviceInfo(info),
    );

    this.keyboardHandler = new KeyboardHandler(this.keyboardLogger);

    this.setupEventListeners();
    this.gamepadHandler.checkForGamepad();
  }

  setupEventListeners() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });

    document
      .getElementById("connectHID")
      .addEventListener("click", async () => {
        await this.hidHandler.connect();
      });

    document.querySelectorAll(".clear-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        if (tabName === "hid") this.hidLogger.clear();
        else if (tabName === "gamepad") this.gamepadLogger.clear();
        else if (tabName === "keyboard") this.keyboardLogger.clear();
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.tab === tabName) {
        button.classList.add("active");
      }
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
      if (content.id === `${tabName}-tab`) {
        content.classList.add("active");
      }
    });
  }

  updateStatus(connected, message, source) {
    this.statusDiv.classList.remove("connected", "disconnected");
    if (connected) {
      this.statusDiv.classList.add("connected");
      this.statusDiv.textContent = `✓ ${message}`;
    } else {
      this.statusDiv.classList.add("disconnected");
      this.statusDiv.textContent = `✗ ${message}`;
    }
  }

  updateDeviceInfo(info) {
    this.deviceInfoDiv.innerHTML = `<div class="device-info">${info}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
