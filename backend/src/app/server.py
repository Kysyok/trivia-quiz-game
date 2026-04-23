import asyncio
from request_manager import request_manager
import socket
import os


async def main(server_socket):
    asyncio_loop = asyncio.get_running_loop()
    tasks = set()
    while True:
        client_socket, full_address = await asyncio_loop.sock_accept(sock=server_socket)
        task = asyncio.create_task(request_manager.serve(client_socket, full_address))
        tasks.add(task)
        task.add_done_callback(lambda t: tasks.discard(t))


if __name__ == "__main__":
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((os.getenv("BIND_TO_ADDRESS"), int(os.getenv("BIND_TO_PORT"))))
    print(f"Connections are listened at {os.getenv("BIND_TO_ADDRESS")}:{os.getenv("BIND_TO_PORT")}")
    server_socket.listen()
    server_socket.setblocking(False)
    try:
        asyncio.run(main(server_socket))
    except KeyboardInterrupt:
        server_socket.close()
        print("The server was stopped")
