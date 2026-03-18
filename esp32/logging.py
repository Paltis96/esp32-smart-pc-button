from esplog.core import Logger

logger = Logger(
    level="DEBUG",          
    log_to_console=True,    
    log_to_file=True,       
    file_name="app_log.txt",
    max_file_size=1024,   
    use_colors=False,       
    log_format="text"   
)
logger.set_level("INFO")