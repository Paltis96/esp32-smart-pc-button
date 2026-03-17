import asyncio
import time
import gc
from settings import conf_general
from power_controller import controller
from api import app
from machine import WDT
from wifi_manager import ensure_wifi, get_wifi_credentials
from logging import logger


# Startup delay.
print('Launching app...')
time.sleep(5)
wdt = WDT(timeout=10000)


async def wdt_task(wdt):
    while True:
        wdt.feed()
        await asyncio.sleep(5)


async def system_monitor():
    while True:
        gc.collect()
        mem = gc.mem_free()
        logger.debug(f"Mem: {mem} bytes")

        if mem < 15000:
            logger.critical("Critically low memory! Restarting...")
            await asyncio.sleep(1)
            import machine
            machine.reset()

        await asyncio.sleep(60)  # Longer sleep is safer


async def guarded_task(task_func, name, delay):
    while True:
        try:
            await task_func()
        except Exception as e:
            logger.error(f"Error in {name}: {e}")
        await asyncio.sleep(delay)


async def background_task():
    while True:
        if conf_general.auto_power_on:
            await controller.tick()
        await asyncio.sleep(conf_general.heartbeat_interval_s)


async def main():
    ssid, pwd = get_wifi_credentials()
    while True:
        if ensure_wifi(ssid, pwd):
            tasks = [
                asyncio.create_task(guarded_task(
                    background_task, "Controller", conf_general.heartbeat_interval_s)),
                asyncio.create_task(system_monitor()),
                asyncio.create_task(wdt_task(wdt))
            ]

            await asyncio.gather(app.start_server(port=80, debug=True), *tasks)
            break
        else:
            logger.info("WiFi connection failed, retrying in 10s...")
            await asyncio.sleep(10)


asyncio.run(main())
