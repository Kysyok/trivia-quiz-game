import json


class HTTPPacker:
    def __init__(self, encoding="utf-8"):
        self.encoding = encoding
        self.packet_newline = "\r\n"

    def extract_endpoint_arguments_and_origin(self, packet):
        header, body = packet.decode(self.encoding).split(self.packet_newline * 2)
        return header.split()[1], json.loads(body), header[header.index("Origin") + 7:].split(self.packet_newline)[0]

    def make_packet_with_json(self, body, origin=None, code=200, phrase="Success"):
        packet = (f"HTTP/1.1 {code} {phrase}\r\n"
                "Content-Type: application/json\r\n" +
                (f"Access-Control-Allow-Origin: {origin}\r\n" if origin else "") +
                "\r\n").encode(self.encoding)
        packet += json.dumps(body).encode(self.encoding)
        return packet
