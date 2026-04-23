import asyncio
import os
import socket
from api.routes.menu import router
from dotenv import load_dotenv
import json


load_dotenv()


class RequestManager:
    def __init__(self, server_buffer):
        self.server_buffer = server_buffer

    async def serve(self, client_socket, full_address):
        """
        Encodes an http-packet, sends it to the Slow API router, sends a response, and closes the client socket
        :param client_socket_and_full_address: a socket's socket.accept() result
        :return: None
        """

        packet_header, packet_body = (
            (await asyncio.get_running_loop().sock_recv(client_socket, self.server_buffer)).decode("utf-8").split("\r\n\r\n"))
        endpoint, arguments, origin = (packet_header.split()[1], json.loads(packet_body),
                                       packet_header[packet_header.index("Origin") + 7:].split("\r\n")[0])
        print(f"Requested: {endpoint}\n"
              f"With arguments: {arguments}\n"
              f"By {full_address[0]}:{full_address[1]}")
        result = await router[endpoint](**arguments)
        await self.respond_and_forget(client_socket, result, origin)

    async def respond_and_forget(self, client_socket, result, origin):
        client_socket.send(self.http_header(origin) + json.dumps(result).encode("utf-8"))
        client_socket.close()

    def http_header(self, origin=None):
        return ("HTTP/1.1 200 Success\r\n"
                "Content-Type: application/json\r\n" +
                (f"Access-Control-Allow-Origin: {origin}\r\n" if origin else "") +
                "\r\n").encode("utf-8")


request_manager = RequestManager(int(os.getenv("SERVER_BUFFER")))
