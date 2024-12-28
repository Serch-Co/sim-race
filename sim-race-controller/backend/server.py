import socket
import requests
import os
import json
from database import Database

db = Database()

rfactor_2_url = os.getenv("RFACTOR2_URL")

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

    ################
    ## SIMULATORS ##
    ################

    # Check simulators status
    def check_simulators_status(self, simulators):
        for simulator in simulators:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect((simulator['ip'], 5001))
                simulator['status'] = True
            except socket.error as e:
                simulator['status'] = False
        db.update_simulator_list(simulators)

    # check simulator status
    def check_simulator_status(self, sim_id):
        simulator = db.read_simulator(sim_id)
        response = {
            'success': True
        }
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((simulator['ip'], 5001))
            simulator['status'] = True
        except socket.error as e:
            simulator['status'] = False
            response['error'] = {
                'code': 1,
                'message': str(e)
            }
        db.update_simulator(sim_id, simulator)
        return response

    ###################
    ## RACE SESSIONS ##
    ###################

    def create_rfactor_2_session(self, session_settings, sittings):
        # Add command to send
        session_settings['command'] = "start_rfactor2"
        # Serialize object ot send to client
        serialized_settings = json.dumps(session_settings)
        # Loop through sittings to not open a simulator that has no sitting
        for sitting  in sittings:
            # Get sim to read its ip and port
            sim = db.read_simulator(sitting['sim_id'])
            try:
                # Connect to the simuator and send command
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    print(sim['ip'],sim['port'])
                    s.connect((sim['ip'], sim['port']))
                    # Send object wiht race settings to client
                    s.sendall(serialized_settings.encode('utf-8'))
                    # Receive response from each client
                    response = s.recv(1024)
                    response_data = json.loads(response.decode('utf-8'))
                    print(f"Response from {sim['id']}: {response_data}")
                    # Check for errors inside the simulator
                    if response_data['error']:
                        # Return error object to front end
                        return {
                            "success": False,
                            "sim_id": sim['id'],
                            "number": sim['number'],
                            "error": response_data['message']
                        }
            except Exception as e:
                # Return error object to front end
                return {
                        "success": False,
                        "sim_id": sim['id'],
                        "number": sim['number'],
                        "error": str(e)
                    }
        # Return success obj to front end
        return {
            "success": True,
            "message": "Success Starting Race"
        }

