import requests
import time

r = requests.post('http://127.0.0.1:8000/trial/api/join_queue/', json={'data': ['http://127.0.0.1:8001/test_rgba.png', 'http://127.0.0.1:8001/test_rgba.png']})
event_id = r.json()['event_id']
print('Event:', event_id)
status = ''
while 'process_completed' not in status and 'process_errored' not in status:
    time.sleep(2)
    st = requests.post('http://127.0.0.1:8000/trial/api/queue_data/', json={'event_id': event_id}).json()
    status = st.get('msg', '')
    print(st)
