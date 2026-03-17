import machine
from settings import conf_general, s_pin
from time import time, sleep
import asyncio


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
        self._host_status = False
        self.target_history = []
        self._targer_status = False
        self._pulse_s = pulse_s
        self._next_allowed_trigger_time = 0
        self._history_limit = history_limit
    @property
    def host_status(self):
        return self._state

    @host_status.setter
    def host_status(self, value):
        if not isinstance(value, bool):
            raise ValueError(f"Invalid state '{value}'.")
        self._host_status = value

    @property
    def targer_status(self):
        return self._state

    @targer_status.setter
    def targer_status(self, value):
        if not isinstance(value, bool):
            raise ValueError(f"Invalid state '{value}'.")
        self.targer_status = value

    async def _tcp_ping(self, host, port=80, timeout=2):
        try:
            print(f"Ping: {host}")
            conn = asyncio.open_connection(host, port)
            reader, writer = await asyncio.wait_for(conn, timeout=timeout)
            writer.close()
            await writer.wait_closed()
            return True
        except Exception as e:
            print(f"Ping error: {e}")
            return False

    def _push_state(self, history, state):
        history.append(state)
        if len(history) > self._history_limit:
            history.pop(0)

    def _is_all_true(self, history) -> bool:
        if self._config.status_sample_size >= history:
            history_sample = history
        else:
            slice_list = self._config.status_sample_size * -1
            history_sample = history[slice_list:]
            
        if len(history_sample) < self._config.status_sample_size:
            return False
        return all(history_sample)

    def trigger_switch(self):
        self._pin.on()
        sleep(self._pulse_s)
        self._pin.off()
        print("Power signal sent")

    def set_delay(self, delay_s):
        self._next_allowed_trigger_time = time() + delay_s

    async def tick(self):
        now = time()

        if not self._config.host_ip:
            print('Host IP address not set.')
            return

        if not self._config.target_ip:
            print('Target IP address not set.')
            return

        host_online = await self._tcp_ping(str(self._config.host_ip))
        await asyncio.sleep(0.01)
        target_online = await self._tcp_ping(str(self._config.target_ip))

        self._push_state(self.host_history, host_online)
        self._push_state(self.target_history, target_online)

        if not host_online and self._is_all_true(self.target_history):
            if now >= self._next_allowed_trigger_time:
                print('Triggering a host to wake up...')
                self.trigger_switch()
                self.set_delay(self._config.retry_delay_s
                               )

    def status(self):
        data = {"host_history": self.host_history,
                "target_history": self.target_history,
                }
        return data


controller = PowerController(conf_general, s_pin)
