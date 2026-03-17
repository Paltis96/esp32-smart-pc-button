import machine
import asyncio
import json
from microdot import Microdot, Response, send_file
from microdot.websocket import with_websocket
from microdot.cors import CORS

from settings import conf_general
from power_controller import controller
from sys_info import get_system_stats
from logging import logger


app = Microdot()


cors = CORS(
    app,
    allowed_origins='*',
    allowed_methods=['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowed_headers=['Content-Type', 'Authorization'],
    max_age=86400,
    allow_credentials=True
)


def json_response(message, data=None, status='success', status_code=200):
    response = {
        'message': message,
        'data': data,
        'status': status
    }
    return Response(json.dumps(response), status_code=status_code, headers={'Content-Type': 'application/json'})


async def delayed_reset(delay=2):
    await asyncio.sleep(delay)
    machine.reset()


@app.route('/')
async def index(request):
    return send_file('static/index.html')


@app.route('/assets/<path:path>')
async def static(request, path):
    if '..' in path:
        return json_response(message='Not found', status='error', status_code=404)
    return send_file('static/assets/' + path)


# API routes
@app.route('/api/config', methods=['GET', 'PUT', 'OPTIONS'])
async def config(request):
    if request.method == 'GET':
        return json_response(message='Config retrieved successfully', data=conf_general.to_dict())

    if request.method == 'PUT':
        if request.content_type != 'application/json':
            return json_response(message='Content-Type must be application/json', status='error', status_code=400)

        data = request.json
        logger.info(data)
        try:
            conf_general.update(data)
            return json_response(message='Configuration updated successfully', data=data)
        except Exception as err:
            return json_response(message=err, status='error', status_code=400)


@app.get('/api/retry_clear')
async def retry_reset(request):
    controller.reset_retry_counter()
    controller.clear_massage()
    return json_response(message='ok', status_code=200)

@app.get('/api/signal')
async def signal(request):
    await controller.trigger_switch()
    return json_response(message='Signal triggered successfully', status_code=200)

@app.get('/api/ping_status')
async def ping_status(request):
    return json_response(message="ok", data=controller.status(), status_code=200)


# Esp board API
@app.get('/api/sys/reboot')
async def reboot(request):
    asyncio.create_task(delayed_reset())
    return json_response(message='Rebooting in 2 seconds...', status_code=202)


@app.get('/api/sys/info')
async def info(request):
    return json_response(message="ok", data=get_system_stats(), status_code=200)

@app.route('/api/sys/logs')
def logs(request):
    return send_file('app_log.txt', content_type='text/plain')
