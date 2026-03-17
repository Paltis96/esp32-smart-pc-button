import json
from machine import Pin
from logging import logger



# GPIO pin connected to optocoupler
s_pin = 4


def dump_config_json(data=None):
    if not data:
        data = {
            "auto_power_on": False,
            "host_ip": '',
            "target_ip": '',
            "heartbeat_interval_s": 60,
            'retry_delay_s': 120,
            'status_sample_size': 3,
        }

    with open('./config.json', 'w') as f:
        json.dump(data, f)


def save_config_json(data):
    with open('./config.json', 'w') as f:
        json.dump(data, f)


try:
    with open('./config.json') as f:
        config_json = json.load(f)
except OSError:
    logger.warning("OSError: Generating new config.json.")
    dump_config_json()
except ValueError:
    logger.warning("ValueError: Generating new config.json.")
    dump_config_json()

with open('./config.json') as f:
    config_json = json.load(f)


class GeneralConfig:
    __slots__ = ("auto_power_on",
                 "host_ip",
                 "target_ip",
                 "heartbeat_interval_s",
                 "retries",
                 "s_pin",
                 'retry_delay_s',
                 'status_sample_size',
                 'history_limit'
                 )
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, config):
        self.auto_power_on = config.get("auto_power_on", False)
        self.host_ip = config.get("host_ip", '')
        self.target_ip = config.get("target_ip", '')
        self.heartbeat_interval_s = config.get("heartbeat_interval_s", 10)
        self.retry_delay_s = config.get("retry_delay_s", 120)
        self.status_sample_size = config.get("status_sample_size", 3)

    def update(self, config):              
        for key in config:
            if hasattr(self, key):
                setattr(self, key, config[key])

        save_config_json(self.to_dict())

    def to_dict(self):
        return {key: getattr(self, key) for key in self.__slots__ if hasattr(self, key)}


conf_general = GeneralConfig(config_json)
