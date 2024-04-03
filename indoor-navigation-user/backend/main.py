from flask import Flask, render_template, send_file, make_response, url_for, Response, redirect, request
import cv2
import base64
import requests
import copy
import networkx as nx
import os
import json

class Node:
  def __init__(self, id, name, category, x, y):
    self.id = id
    self.name = name
    self.category = category
    self.x = x
    self.y = y

  def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


node0 = Node(0, "Armonia", "store", 997, 349)
node1 = Node(1, "Lift", "lift", 986, 376)
node2 = Node(2, "Washroom", "washroom", 984, 417)
node3 = Node(3, "Lift", "lift", 986, 476)
node4 = Node(4, "Staircase", "staircase", 991, 498)
node5 = Node(6, "Bombay Store", "store", 980, 635)
node6 = Node(5, "Turn", "direction", 1036, 550)
node7 = Node(7, "LG", "store", 1087, 553)
node8 = Node(8, "Turn", "direction", 1137, 502)
node9 = Node(9, "Hitachi", "store", 1191, 562)

node10 = Node(10, "Turn", "direction", 1275, 643)
node11 = Node(11, "Apple Servicee Centre", "store", 1184, 705)
node12 = Node(12, "Turn", "direction", 911, 726)
node13 = Node(13, "Turn", "direction", 911, 640)
node14 = Node(14, "Haldiram Store", "store", 1175, 497)
node15 = Node(15, "Uniqlo", "store", 1146, 413)
node16 = Node(16, "Market 99", "store", 1150, 320)
node17 = Node(17, "Turn", "direction", 1002, 318)
node18 = Node(18, "Turn", "direction", 773, 242)
node19 = Node(19, "MAX", "store", 666, 291)

node20 = Node(20, "Turn", "direction", 586, 266)
node21 = Node(21, "Washroom", "washroom", 614, 395)
node22 = Node(22, "Lift", "lift", 613, 417)
node23 = Node(23, "Staircase", "staircase", 608, 535)
node24 = Node(24, "Staircase", "staircase", 610, 761)
node25 = Node(25, "Home Centre", "store", 752, 737)
node26 = Node(26, "Smart Bazaar", "store", 417, 304)
node27 = Node(27, "Turn", "direction", 499, 401)
node28 = Node(28, "Staircase", "staircase", 421, 451)

node29 = Node(29, "Turn", "direction", 1008, 316)

nodes = []
g = globals()

for i in range(29):
  varname = 'node{}'.format(i)
  nodes.append(g[varname])

nav = {}

for i in range(29):
  nav[i] = []

nav[0].append(node1)
nav[0].append(node17)

nav[1].append(node0)
nav[1].append(node2)

nav[2].append(node1)
nav[2].append(node3)

nav[3].append(node2)
nav[3].append(node4)

nav[4].append(node3)
nav[4].append(node5)

nav[5].append(node4)
nav[5].append(node6)
nav[5].append(node7)

nav[6].append(node5)
nav[6].append(node13)

nav[7].append(node5)
nav[7].append(node8)

nav[8].append(node7)
nav[8].append(node9)
nav[8].append(node14)
nav[8].append(node15)

nav[9].append(node8)
nav[9].append(node10)

nav[10].append(node9)
nav[10].append(node11)

nav[11].append(node10)
nav[11].append(node12)

nav[12].append(node11)
nav[12].append(node13)
nav[12].append(node25)

nav[13].append(node12)
nav[13].append(node6)

nav[14].append(node8)

nav[15].append(node8)
nav[15].append(node16)

nav[16].append(node15)
nav[16].append(node17)

nav[17].append(node16)
nav[17].append(node0)

nav[18].append(node17)
nav[18].append(node19)

nav[19].append(node18)
nav[19].append(node20)

nav[20].append(node19)
nav[20].append(node21)
nav[20].append(node26)
nav[20].append(node27)

nav[21].append(node20)
nav[21].append(node22)

nav[22].append(node21)
nav[22].append(node23)

nav[23].append(node22)
nav[23].append(node24)

nav[24].append(node23)
nav[24].append(node25)

nav[25].append(node24)
nav[25].append(node12)

nav[26].append(node20)

nav[27].append(node20)
nav[27].append(node28)

nav[28].append(node27)


G = nx.Graph()

for node in nav:
  for neighbour in nav[node]:
    G.add_edge(node, neighbour.id)

# initialise app  
app = Flask(__name__, static_folder='./../frontend/build', static_url_path='/')


@app.route('/generatePath', methods=["POST"])
def printShortestPath():
  data = request.get_json()

  # print(data)

  src = data['src']
  dest = data['dest']

  src_id = -1
  dest_id = -1

  if dest != "lift" and dest != "service" and dest != "staircase":
    for node in nodes:
      if node.name == src:
        src_id = node.id
      if node.name == dest:
        dest_id = node.id

      if src_id != -1 and dest_id != -1:
        break
  else:
    min_distance = 1000
    for node in nodes:
      if node.name == src:
        src_id = node.id
        break

    for node in nodes:
      if node.category == dest:
        temp_min_distance = nx.shortest_path_length(
            G, source=src_id, target=node.id)
        if temp_min_distance < min_distance:
          min_distance = temp_min_distance
          dest_id = node.id

  path = []
  if src_id == -1 or dest_id == -1:
    print("Source or Destination Not Found")
  else:
    path = nx.shortest_path(G, source=src_id, target=dest_id)

  node_path = []
  coords = []
  for node in path:
    for poi in nodes:
      if poi.id == node:
        coords.append(poi.x)
        coords.append(poi.y)

  for node in path:
    for poi in nodes:
      if poi.id == node:
        node_path.append(poi)
        break
  
  print(node_path)
  # return render_template('path.html', data=[os.path.exists("./sample.jpg")])

  image = cv2.imread('./test.png')

  src_icon = cv2.imread('./start.png')
  dest_icon = cv2.imread('./end.png')
  curr_icon = cv2.imread('./curr.png')

  # return render_template('path.html', data=[image, src_icon])

  for i in range(len(node_path)-1):
    cv2.line(image, (node_path[i].x, node_path[i].y),
             (node_path[i+1].x, node_path[i+1].y), (255, 0, 0), 2)

  src_icon = cv2.resize(src_icon, (25, 25))
  dest_icon = cv2.resize(dest_icon, (25, 25))
  curr_icon = cv2.resize(curr_icon, (25, 25))

  x_offset = node_path[0].x-12
  y_offset = node_path[0].y-12

  image[y_offset:y_offset+src_icon.shape[0],
      x_offset:x_offset+src_icon.shape[1]] = src_icon

  x_offset = node_path[len(node_path)-1].x-12
  y_offset = node_path[len(node_path)-1].y-12

  image[y_offset:y_offset+src_icon.shape[0],
      x_offset:x_offset+src_icon.shape[1]] = dest_icon

  img_links = []

  for i in range(1, len(node_path)-1):

    x_offset = node_path[i].x-12
    y_offset = node_path[i].y-12
    temp_image = copy.deepcopy(image)
    temp_image[y_offset:y_offset+src_icon.shape[0],
        x_offset:x_offset+src_icon.shape[1]] = curr_icon

    retval, buffer = cv2.imencode('.jpg', temp_image)
    image_text = base64.b64encode(buffer)
    img_links.append(image_text.decode('utf-8'))

  retval, buffer = cv2.imencode('.jpg', image)
  image_text = base64.b64encode(buffer)
  img_links.append(image_text.decode('utf-8'))
  
  # for link in img_links:
  #   print(type(link))
  #   print(link[:10])
  #   print(link.decode('utf-8')[0:10])
  #   break

  return {
    'path': img_links, 'coords': coords
  }

@app.route('/data', methods=["GET"])
def get_pois():
    return {
        'poi':["Armonia",
"lift",
"washroom",
"staircase",
"Bombay Store",
"LG",
"Hitachi",
"Apple Servicee Centre",
"Haldiram Store",
"Uniqlo",
"Market 99",
"MAX",
"Home Centre",
"Smart Bazaar"], 
        }

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
 	app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 5000))
