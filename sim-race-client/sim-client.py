import socket
import subprocess
import json

# Configuration for games
# TODO change f1 path for when f1 is available
rfactor2_path = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rFactor 2\\Bin64\\rFactor2.exe"
f1_path = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rFactor 2\\Bin64\\rFactor2.exe"
server_ip = "192.168.1.155"
server_password = "password123"

# Set up the socket to listen for commands
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(('0.0.0.0', 5001))  # Listens on port 5001
    s.listen()
    print("Client app listening for commands...")
    
    while True:
        conn, addr = s.accept()
        with conn:
            try:
                print(f"Connected by {addr}")
                settings = conn.recv(1024)
                settings_obj = json.loads(settings.decode('utf-8'))
                print(settings_obj)
                if settings_obj.get('command') == "start_rfactor2":
                    command = f'"{rfactor2_path}" +connect={server_ip} +password={server_password}'
                    # subprocess.Popen(command)
                    subprocess.Popen(f'"{rfactor2_path}"')
                    conn.sendall(b"rFactor 2 launched:")
                elif settings_obj.get('command') == "start_exo_cross":
                    command = f'"{f1_path}" +connect={server_ip} +password={server_password}'
                    # subprocess.Popen(command)
                    subprocess.Popen(f'"{f1_path}"')
                    conn.sendall(b"Exo Cross launched:")
                else:
                    conn.sendall(b"Unknown command:")
            except Exception as e:
                error_obj = {
                    'error': True,
                    'message':str(e)
                    }
                error_serialized = json.dumps(error_obj)
                error_bytes = error_serialized.encode('utf-8')
                conn.sendall(error_bytes)

