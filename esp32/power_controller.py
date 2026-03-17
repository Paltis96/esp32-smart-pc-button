import machine
from settings import conf_general, s_pin
from time import time, sleep
import asyncio
from logging import logger


class PowerController:
    def __init__(self,
                 config,
                 pin=4,
                 pulse_s=1,
                 history_limit=10
                 ):

        self._config = config
        self._pin = machine.Pin(pin, machine.Pin.OUT)

        self.host_history = []
        self.target_history = []
        self._pulse_s = pulse_s
        self._next_allowed_trigger_time = 0
        self._history_limit = history_limit
   

    async def _tcp_check(self, host, port=80, timeout=2):
        try:
            logger.debug(f"Ping: {host}")
            conn = asyncio.open_connection(host, port)
            reader, writer = await asyncio.wait_for(conn, timeout=timeout)
            writer.close()
            await writer.wait_closed()
            return True
        except Exception as e:
            logger.warning(f"Ping error: {e}")
            return False

    def _push_state(self, history, state):
        history.append(state)
        if len(history) > self._history_limit:
            history.pop(0)

    def _stable_state(self, history):
        if len(history) < self._config.status_sample_size:
            return False
        return all(history[-self._config.status_sample_size:])

    async def trigger_switch(self):
        self._pin.on()
        await asyncio.sleep(self._pulse_s)
        self._pin.off()
        logger.info("Power signal sent")

    def set_delay(self, delay_s):
        self._next_allowed_trigger_time = time() + delay_s


    async def tick(self):
        now = time()

        if not self._config.host_ip:
            logger.warning('Host IP address not set.')
            return

        if not self._config.target_ip:
            logger.warning('Target IP address not set.')
            return

        host_online = await self._tcp_check(str(self._config.host_ip))
        await asyncio.sleep(0.01)
        target_online = await self._tcp_check(str(self._config.target_ip))
        
        hs = 'up' if host_online else 'down'
        ts = 'up' if target_online else 'down'
        
        logger.info(f"Host {self._config.host_ip}: {hs} | Target {self._config.target_ip}: {ts}")
        
        self._push_state(self.host_history, host_online)
        self._push_state(self.target_history, target_online)
        
        host_stable = self._stable_state(self.host_history)
        target_stable = self._stable_state(self.target_history)
        
        if not host_stable and target_stable:
            if now >= self._next_allowed_trigger_time:
                logger.info('Triggering a host to wake up...')
                await self.trigger_switch()
                self.set_delay(self._config.retry_delay_s)
                logger.info(f"Next retry in {self._config.retry_delay_s}s")
                
    def status(self):
        data = {"host_history": self.host_history,
                "target_history": self.target_history,
                }
        return data


controller = PowerController(conf_general, s_pin)
