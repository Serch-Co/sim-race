import socket

## Hardcoded for now
client_ips = ['192.168.1.105',"192.168.1.71"]  # List of client IPs
port = 5000

for client_ip in client_ips:
    print(client_ip)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((client_ip, port))
        s.sendall(b"start_rfactor2")
        response = s.recv(1024)
        print(f"Response from {client_ip}: {response.decode()}")
