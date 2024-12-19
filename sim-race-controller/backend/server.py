import socket
from database import Database

db = Database()

class Server:
    def __init__(self):
        pass
    
    #######################################
    ###   Hardcoded for now
    # client_ips = ['192.168.1.105',"192.168.1.71"]  # List of client IPs
    # port = 5000

    # for client_ip in client_ips:
    #     print(client_ip)
    #     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    #         s.connect((client_ip, port))
    #         s.sendall(b"start_rfactor2")
    #         response = s.recv(1024)
    #         print(f"Response from {client_ip}: {response.decode()}")
    #######################################

    # Check simulators status
    def check_simulators_status(self, simulators):
        for simulator in simulators:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect((simulator['ip'], 8080))
                simulator['status'] = True
            except socket.error as e:
                simulator['status'] = False
        db.update_simulator_list(simulators)


        