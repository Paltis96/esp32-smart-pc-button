import network
import time


def ensure_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.config(hostname='esp32-pc-button')
    if not wlan.isconnected():
        print(f"Connecting to {ssid}...")

        try:
            wlan.connect(ssid, password)
        except Exception as err:
            print(err)
            print('Failed to connect to Wi-Fi.')
            return False

        max_wait = 20
        while max_wait > 0:
            if wlan.isconnected():
                break
            max_wait -= 1
            print('Waiting for connection...')
            time.sleep(1)

    if wlan.isconnected():
        print(f"Connected! IP: {wlan.ifconfig()[0]}")
        return True
    else:
        print("Failed to connect to Wi-Fi.")
        return False
