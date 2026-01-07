export class HIDHandler {
  // TODO: probably need a better udnerstanding
  constructor(logger, statusCallback, deviceInfoCallback) {
    this.logger = logger;
    this.statusCallback = statusCallback;
    this.deviceInfoCallback = deviceInfoCallback;
    this.hidDevice = null;
  }

  async connect() {
    if (!navigator.hid) {
      this.logger.log(
        "WebHID is not supported in this browser. Try Chrome or Edge.",
        { error: true },
      );
      return false;
    }

    try {
      const devices = await navigator.hid.requestDevice({ filters: [] });

      if (devices.length === 0) {
        this.logger.log("No device selected");
        return false;
      }

      this.hidDevice = devices[0];
      await this.hidDevice.open();

      this.statusCallback(
        true,
        `HID: ${this.hidDevice.productName || "Unknown"}`,
      );

      this.deviceInfoCallback(`
                <strong>HID Device:</strong><br>
                Product: ${this.hidDevice.productName || "Unknown"}<br>
                Vendor: ${this.hidDevice.vendorId} (0x${this.hidDevice.vendorId.toString(16)})<br>
                Product ID: ${this.hidDevice.productId} (0x${this.hidDevice.productId.toString(16)})<br>
                Collections: ${this.hidDevice.collections.length}
            `);

      this.logger.log(
        `Connected: ${this.hidDevice.productName || "Unknown Device"}`,
      );
      this.logger.log(
        `Vendor ID: 0x${this.hidDevice.vendorId.toString(16)}, Product ID: 0x${this.hidDevice.productId.toString(16)}`,
      );

      this.hidDevice.addEventListener("inputreport", (event) => {
        const { data, reportId } = event;
        this.logger.log(`Report ID: ${reportId}`, new Uint8Array(data.buffer));
      });

      return true;
    } catch (error) {
      this.logger.log(`Error: ${error.message}`, { error: true });
      console.error(error);
      return false;
    }
  }

  disconnect() {
    if (this.hidDevice) {
      this.hidDevice.close();
      this.hidDevice = null;
      return true;
    }
    return false;
  }
}
