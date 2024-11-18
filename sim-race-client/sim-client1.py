import socket
import subprocess

# Configuration for games
# TODO change exocross path for when exocross is available
rfactor2_path = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rFactor 2\\Bin64\\rFactor2.exe"
exocross_path = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rFactor 2\\Bin64\\rFactor2.exe"
server_ip = "192.168.1.155"
server_password = "password123"

# Set up the socket to listen for commands
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(('0.0.0.0', 5000))  # Listens on port 5000
    s.listen()
    print("Client app listening for commands...")
    
    while True:
        conn, addr = s.accept()
        with conn:
            print(f"Connected by {addr}")
            command = conn.recv(1024).decode()
            
            if command == "start_rfactor2":
                command = f'"{rfactor2_path}" +connect={server_ip} +password={server_password}'
                # subprocess.Popen(command)
                subprocess.Popen(f'"{rfactor2_path}"')
                conn.sendall(b"rFactor 2 launched in Sim 1")
            elif command == "start_exo_cross":
                command = f'"{exocross_path}" +connect={server_ip} +password={server_password}'
                # subprocess.Popen(command)
                subprocess.Popen(f'"{exocross_path}"')
                conn.sendall(b"Exo Cross launched in Sim 1")
            else:
                conn.sendall(b"Unknown command")
