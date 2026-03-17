import network
import time
from logging import logger


def get_wifi_credentials():
    with open('wifi.txt', 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
        
        wifi_name = lines[0].strip()
        wifi_pass = lines[1].strip()
        return  wifi_name, wifi_pass


def ensure_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.config(hostname='esp32-pc-button')
    if not wlan.isconnected():
        logger.info(f"Connecting to {ssid}...")

        try:
            wlan.connect(ssid, password)
        except Exception as err:
            logger.error(err)
            logger.warning('Failed to connect to Wi-Fi.')
            return False

        max_wait = 20
        while max_wait > 0:
            if wlan.isconnected():
                break
            max_wait -= 1
            logger.info('Waiting for connection...')
            time.sleep(1)

    if wlan.isconnected():
        print(f"Connected! IP: {wlan.ifconfig()[0]}")
        return True
    else:
        print("Failed to connect to Wi-Fi.")
        return False
