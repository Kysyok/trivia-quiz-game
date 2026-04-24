import asyncio
from dotenv import load_dotenv

from api.routes.game_ep import game_ep_router
from api.routes.lobby import lobby_router
from api.routes.menu import menu_router
from app.tools.logger import logger
import os
from app.server.concurrent_tcp_http_server import ConcurrentTCPHTTPServer


if __name__ == "__main__":
    load_dotenv()
    server = ConcurrentTCPHTTPServer(
        os.getenv("BIND_TO_ADDRESS"),
        int(os.getenv("BIND_TO_PORT")),
        int(os.getenv("SERVER_BUFFER"))
    )
    server.register_router(lobby_router, menu_router, game_ep_router)
    try:
        asyncio.run(server.auto_serve_loop())
    except KeyboardInterrupt:
        server.socket.close()
        logger.info("Server was stopped")
