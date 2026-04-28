# 🎮 Multiplayer Trivia Quiz Game

A turn-based multiplayer trivia quiz game built using Python sockets.  
Players connect to a server, join game rooms, answer questions, and compete based on their scores.

---

## 📌 Project Overview

This project implements **Project 4 (Variant B)** from the Distributed and Network Programming course:

> A multiplayer game server using TCP sockets where players interact in turn-based gameplay and scores are tracked. 

The system focuses on:
- Real-time client-server communication
- State synchronization across players
- Fault tolerance and disconnection handling

---

## 🧠 Features

### 🎯 Core Functionality
- Multiplayer support (2–5 players per game)
- Turn-based trivia gameplay
- Question-answer system
- Score tracking and leaderboard
- Game rooms (lobby system)

### 🔄 Networking & Synchronization
- TCP socket-based communication
- Server-managed game state
- Round transitions and synchronization logs

### ⚡ Robustness
- Handles unexpected client disconnections
- Maintains consistent game state
- Logs key events (joins, answers, rounds)

---

## 🏗️ System Architecture
```text
Clients (Browser / JS UI)
        ↓
API Layer (JavaScript)
        ↓
TCP Socket Server (Python)
        ↓
Game Engine (State Management)
        ↓
Question / Player / Room Modules
```

## 🏗️ Backend Structure

```
backend/
 ├── src/
 │   ├── api/           
 │   ├── app/            
 │   │   ├── game/      
 │   │   ├── server/     
 │   │   ├── tools/      
 ├── .dockerignore
 ├── .env.example        
 ├── Dockerfile          
 ├── docker-compose.yaml 
 ├── pyproject.toml    
 └── uv.lock             
```

### 🌐 Frontend Structure
```text
front/
├── public/
│ ├── css/
│ ├── js/
│ ├── *.html # UI pages (join, lobby, quiz, leaderboard)
└── docker-compose.yaml 
```

---

## ⚙️ Technologies Used

- **Python** — backend logic and socket server
- **TCP Sockets** — real-time communication
- **JavaScript** — frontend interaction
- **Docker** — containerization
- **HTML/CSS** — user interface

---

## 🚀 Installation & Setup

### 🔧 Prerequisites
- Python 3.14+
- Docker & Docker Compose (optional but recommended)

---
### 🚀 Project setup
1. Make a copy of ```backend/src/.env.example``` nearby, name it ```.env``` 
so the project can use defined there variables

### For local development
2. Make sure the ```.env``` variable ```BIND_TO_ADDRESS``` is set to ```localhost```
3. Make sure the ```const SERVER_ADDRESS``` in ```front/public/js/tools/api_client.js```
is set to ```localhost:12338```
3. If you are using WebStorm, mark ```front/public``` directory as a Resource Root 
(right mouse button ⇾ Mark Directory As)
4. Use ```uv sync``` from inside ```backend``` to setup a local Python
environment with [uv](https://docs.astral.sh/uv/)
5. Run the command ```docker compose up``` from the ```front``` directory, an
[nginx](https://nginx.org/) server will be raised at your machine 80 port, 
from where you will be able to access ```http://localhost/join.html```
6. Run the ```backend/src/app/main.py``` with Python — the game server will be raised

### For deployment with [Docker](https://www.docker.com/)
2. Make sure the ```.env``` variable ```BIND_TO_ADDRESS``` is set to ```0.0.0.0``` without quotes
3. Make sure the ```const SERVER_ADDRESS``` in ```front/public/js/tools/api_client.js```
   is set to ```${YOUR_SERVER_PUBLIC_IP}:12338```
4. Send both ```frontend``` and ```backend``` folders to your server
5. Run ```docker compose up``` from both ```frontend``` and ```backend``` directories
---

## 🎮 How to Use

1. Open the frontend in your browser  
2. Enter a username  
3. Join or create a game room  
4. Wait for other players  
5. Answer questions when it's your turn  
6. View final scores on the leaderboard  

---

## 📊 Validation & Testing

The system was tested according to the project requirements:

### ✅ Synchronization Logs
- Round transitions logged  
- Player actions recorded  

### ✅ Latency Testing
- Tested with 3–5 concurrent players  
- Measured response time and message delivery  

### ✅ Fault Tolerance
- Simulated player disconnections  
- Verified server stability and state recovery  

---

## 📈 Performance Observations

- Low latency for turn-based interactions  
- Stable performance with up to 5 players  
- Minor delays under simultaneous actions (expected in TCP queueing)  

---

## ⚠️ Known Limitations

- No authentication system  
- Limited scalability beyond small groups  
- UI is minimal (focus was on networking)  

---

## 📚 References

- Python Socket Programming Documentation  
- Distributed Systems Course Materials  
- RFC 793 (TCP Protocol)

---

## 🎥 Demo

👉 [Demo video](https://drive.google.com/file/d/1IfvZY58kftprTMDybQU7FJrwYgS-M5qj/view?usp=sharing) 

## 👥 Authors

[Veronika Cherkasova](https://github.com/VeronikaCherkasova) · [Danil Chegaev](https://github.com/danillatency) · [Anna Morozova](https://github.com/AnnaMorza) · [Sofia Seliutina](https://github.com/SofiaSelyutina) · [Karina Krotova](https://github.com/karmihkr)  

---

## 📄 License

Licensed under the MIT License.
