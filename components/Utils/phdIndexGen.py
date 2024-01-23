import pandas as pd
import json
import re

def format_string(input_string):
    input_string = input_string.strip()
    input_string = re.sub(r'\s+', '-', input_string)
    
    return input_string

excel_file = pd.ExcelFile('Keywords_PhD.xlsx')

sheet_names = excel_file.sheet_names

data = {}

for sheet_name in sheet_names:
    data[sheet_name] = excel_file.parse(sheet_name)

index_dict = {}
idx = 1
for sheet_name in sheet_names:
    # get list of value from rows of 2nd column
    if(sheet_name == 'HSS'):
        values = data[sheet_name].iloc[:, 3].values.tolist()
    else:
        values = data[sheet_name].iloc[:, 1].values.tolist()
    for value in values:
        index_dict[idx] = sheet_name + '-' + format_string(value)
        idx+=1

with open('phdIndex.json', 'w') as fp:
    json.dump(index_dict, fp)