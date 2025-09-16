import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Unir al grupo del chat
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Salir del grupo del chat
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Recibir mensaje desde WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]

        # Enviar mensaje al grupo del chat
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat_message", "message": message, "username": username},
        )

    # Recibir mensaje del grupo
    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        # Enviar mensaje al WebSocket
        await self.send(
            text_data=json.dumps({"message": message, "username": username})
        )
