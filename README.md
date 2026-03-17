# ESP32 Smart PC Power Button

An ESP32-based device that simulates a PC power button, allowing
remote control and automatic startup after power outages.

# Features

-   Remote PC power control
-   Automatic wake-up based on network device monitoring
-   Web interface for configuration and management
-   REST API for automation and integrations


## Table of Contents

- [ESP32 Smart PC Power Button](#esp32-smart-pc-power-button)
- [Features](#features)
  - [Table of Contents](#table-of-contents)
- [How It Works](#how-it-works)
- [Hardware Requirements](#hardware-requirements)
- [Wiring Diagram](#wiring-diagram)
- [Software Stack](#software-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
  - [1. Flash MicroPython](#1-flash-micropython)
  - [2. Download code](#2-download-code)
  - [3. Upload Firmware to ESP32](#3-upload-firmware-to-esp32)
  - [4. Configure Settings](#4-configure-settings)
  - [5. Run the Device](#5-run-the-device)
- [General Configuration](#general-configuration)
- [REST API](#rest-api)
- [Home Assistant Integration Example](#home-assistant-integration-example)
- [Future Improvements](#future-improvements)
- [License](#license)


# How It Works

The ESP32 connects to your local network and monitors selected
devices (any wifi device in network).

When **Auto Power On** is enabled:

1. The ESP32 periodically checks whether the monitored device responds
   to network requests.
2. If the device becomes reachable while the PC is still off, the ESP32
   triggers the motherboard **power button signal** using an optocoupler.
3. The PC powers on automatically.

This allows the computer to **recover automatically after power outages** when restoring the last state and WoL don't work.

When **Auto Power On** is disabled, the device behaves like a simple
**Wi-Fi-controlled power button** that can be triggered through the
Web UI or REST API.

> [!NOTE] 
> Because the PC's status is checked via the network connection, 
the **Auto Power On** feature may cause an endless reboot loop if there are network issues on the PC's end.

![Web UI](images/smart_switch_web_ui.png)


# Hardware Requirements

-   ESP32‑C3 SuperMini (or compatible ESP32 board)
-   PC817 optocoupler
-   330Ω resistor
-   Jumper wires
-   Optional breakout board
-   Optional enclosure

> [!NOTE] 
> Some ESP32‑C3 SuperMini boards have **weak Wi‑Fi signal stability**
because the antenna is placed very close to other components.
> A simple fix is to solder a **\~3 cm copper wire** to the antenna pad
indicated in the diagram.
>
> Some boards also lack an exposed **reset pin**, so you may need to
solder directly to the reset button pads.


# Wiring Diagram

The full wiring diagram and assembly example are shown below.

![Wiring diagram](images/smart_switch_schema.png)

![Assembled device](images/smart_switch_img.png)

![Device close-up](images/smart_switch_img2.png)


# Software Stack

-   **MicroPython** -- ESP32 firmware
-   **SolidJS** -- Web interface
-   **Node.js** -- frontend build system


# Quick Start

1. Flash **MicroPython** to the ESP32-C3.
2. Download latest available version on [Releases page](https://github.com/Paltis96/esp32-smart-pc-button/releases).
3. Upload the contents of the `esp32` directory to the device.
4. Edit `esp32/settings.py` and set your Wi-Fi credentials.
5. Restart the ESP32.
6. Open the ESP32 IP address in your browser to access the **Web UI**.

The device is now ready to control your PC power button.


# Installation

## 1. Flash MicroPython

Download firmware for ESP32‑C3:

https://micropython.org/download/ESP32_GENERIC_C3/

You can flash it using **esptool** or:

https://adafruit.github.io/Adafruit_WebSerial_ESPTool/


## 2. Download code

The latest available version can be found on the [Releases page](https://github.com/Paltis96/esp32-smart-pc-button/releases).


## 3. Upload Firmware to ESP32

Upload the contents of the `esp32` directory to the device.

A convenient method is using **Thonny IDE**:

https://thonny.org/

Setup guide:

https://randomnerdtutorials.com/getting-started-thonny-micropython-python-ide-esp32-esp8266/


## 4. Configure Settings
Add `wifi.txt` with WiFi credentials:

``` bash
YOUR_WIFI
YOUR_PASSWORD
```

You can also edit `settings.py` to set GPIO pin.

``` python
# esp32/settings.py

# GPIO pin connected to optocoupler
s_pin = 4
```



## 5. Run the Device

After uploading the files, restart the ESP32.

The device will connect to Wi‑Fi and print the assigned **IP address**
in the serial console or find the device by its hostname **esp32-pc-button**. 

Open the address in your browser to access the **Web UI**.

# General Configuration

| Field                     | Description                                                                | Notes                                             |
| ------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| `auto_power_on`           | Automatically powers on the PC when the monitored device becomes available |                                                   |
| `host_ip`                 | IP address used to check whether the PC is online                          | Must be valid IPv4                                |
| `target_ip`               | IP address of the device being monitored                                   | Must be valid IPv4                                |
| `heartbeat_interval_s`    | Time interval between connectivity checks                                  | Not recomended sey lover then 30 seccons          |
| `retry_delay_s`           | Delay before retrying power-on if the PC did not start                     | Must be higher then PC boot time (1.5, 2 times)   |
| `status_sample_size`      | Number of consecutive checks to confirm online/offline status              | Range: 1–10; higher values reduce false positives |
| `allow_power_retry_limit` | Enables limiting the number of power-on retry attempts                     |                                                   |
| `power_retry_limit`       | Maximum number of retry attempts                                           | Required when retry limit is enabled; minimum: 1  |

# REST API

Access the API through the IP address assigned to the ESP32.

  | Method | Endpoint           | Description                  |
  | ------ | ------------------ | ---------------------------- |
  | GET    | `/api/config`      | Get current configuration    |
  | PUT    | `/api/config`      | Update configuration         |
  | GET    | `/api/signal`      | Trigger power signal         |
  | GET    | `/api/retry_clear` | Clear retry counter          |
  | GET    | `/api/ping_status` | Get device monitoring status |
  | GET    | `/api/sys/reboot`  | Reboot ESP32                 |
  | GET    | `/api/sys/info`    | Get system information       |
  | GET    | `/api/sys/logs`    | Get system logs              |


# Home Assistant Integration Example

Example REST command configuration:

``` yaml
rest_command:
  pc_power_on:
    url: "http://ESP_IP/api/signal"
    method: GET
```

Example button:

``` yaml
button:
  - platform: template
    buttons:
      pc_power_button:
        friendly_name: "Power PC"
        press:
          service: rest_command.pc_power_on
```
# Future Improvements

Planned ideas and possible future enhancements:

- Wi-Fi setup mode (initial configuration through a temporary access point)
- Wi-Fi reset functionality to clear saved credentials and re-enter setup mode
- Add the ability to configure multiple devices for control.
- Allow monitoring **multiple network devices** simultaneously
- Add **MQTT support** for deeper Home Assistant integration
- Improve **network monitoring logic** (custom intervals, retries, thresholds)

# License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.