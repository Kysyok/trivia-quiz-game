import asyncio
import socket
from api.slow_api.router import SlowAPIRouter
from app.server.http_packer import HTTPPacker
from app.tools.logger import logger


class ConcurrentTCPHTTPServer:
    def __init__(self, ip_address, port, buffer_byte_size=1024):
        self.asyncio_loop = None
        self.router = SlowAPIRouter("Main")
        self.packer = HTTPPacker()

        self.buffer_byte_size = buffer_byte_size
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.bind((ip_address, port))
        self.socket.listen()
        self.socket.setblocking(False)
        logger.info(f"Connections are listened at {ip_address}:{port}")

        self.serving_tasks = set()

    async def auto_serve_loop(self):
        self.asyncio_loop = asyncio.get_running_loop()
        while True:
            await self.accept_connection_and_start_serving()

    async def accept_connection_and_start_serving(self):
        client_socket, from_address = await self.asyncio_loop.sock_accept(sock=self.socket)
        task = asyncio.create_task(self.serve_request_from(client_socket, from_address))
        self.serving_tasks.add(task)
        task.add_done_callback(lambda t: self.serving_tasks.discard(t))

    async def serve_request_from(self, client_socket, from_address):
        packet = await self.asyncio_loop.sock_recv(client_socket, self.buffer_byte_size)
        endpoint, arguments, origin = self.packer.extract_endpoint_arguments_and_origin(packet)
        logger.info(f"Request from {from_address[0]}:{from_address[1]} to {endpoint}"
                    f"({", ".join(f"{elem[0]}={elem[1]}" for elem in arguments.items())})")

        serve_result = await self.router[endpoint](**arguments)
        logger.info(f"Response to {from_address[0]}:{from_address[1]} — {serve_result}")

        self.send_response_and_forget(client_socket, serve_result, origin)

    def send_response_and_forget(self, client_socket, json_body, allowed_origin=None):
        packet = self.packer.make_packet_with_json(json_body, allowed_origin)
        client_socket.send(packet)
        client_socket.close()

    def register_router(self, *routers):
        for router in routers:
            self.router += router
