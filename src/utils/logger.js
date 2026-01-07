export class Logger {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  log(message, data = null) {
    const entry = document.createElement("div");
    entry.className = "log-entry";

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });

    let content = `<span class="timestamp">[${timestamp}]</span> ${message}`;

    if (data) {
      if (data instanceof DataView || data instanceof Uint8Array) {
        const arr =
          data instanceof DataView ? new Uint8Array(data.buffer) : data;
        const hex = Array.from(arr)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
        const dec = Array.from(arr).join(", ");
        content += `<br>  HEX: <span class="data-hex">${hex}</span>`;
        content += `<br>  DEC: <span class="data-dec">${dec}</span>`;
      } else {
        content += `<br>  ${JSON.stringify(data, null, 2)}`;
      }
    }

    entry.innerHTML = content;
    this.container.appendChild(entry);
    this.container.scrollTop = this.container.scrollHeight;
  }

  clear() {
    this.container.innerHTML =
      '<div class="empty-state">Waiting for input...</div>';
  }
}
