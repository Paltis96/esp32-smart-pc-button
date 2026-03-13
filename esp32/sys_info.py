import machine
import network
import gc


def wifi_signal_status(rssi):
    if rssi >= -50:
        return f"Excellent {rssi} dBm"
    elif rssi >= -65:
        return f"Good {rssi} dBm"
    elif rssi >= -75:
        return f"Fair {rssi} dBm"
    else:
        return f"Poor {rssi} dBm"


def get_system_stats():
    wlan = network.WLAN(network.STA_IF)

    # temp_c = (esp32.mcu_temperature() - 32) * 5 / 9

    stats = {
        "cpu": {
            "freq_mhz": machine.freq() // 1000000,
            # "internal_temp_c": round(temp_c, 2)
        },
        "memory": {
            "free_kb": gc.mem_free() // 1024,
            "allocated_kb": gc.mem_alloc() // 1024
        },
        "network": {
            "connected": wlan.isconnected(),
            "rssi": wifi_signal_status(wlan.status('rssi')) if wlan.isconnected() else None,
        }
    }
    return stats
