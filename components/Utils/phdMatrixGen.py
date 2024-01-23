import json

with open("phdIndex.json", 'r') as json_file:
    data = json.load(json_file)

# dict = {}

list = []

for idx in data:
    dept = data[idx].split('-')[0]
    if dept not in list:
        list.append(dept)
    # keyword = data[idx].split('-', 1)[1]
    # if dept not in dict:
    #     dict[dept] = {}
    # dict[dept][keyword] = idx

# print(dict)
# with open('phdMatrix.json', 'w') as fp:
#     json.dump(dict, fp)

with open('phsDept.json', 'w') as fp:
    json.dump(list, fp)