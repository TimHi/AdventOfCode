import os
import re
import shutil

def trailing_number(d):
    m = re.search(r'\d+$', d)
    return int(m.group()) if m else int(0)

def get_most_recent_day(path):
    filtered_directories = list(filter(lambda f : os.path.isdir(f) and f != '.idea' and f != 'template',os.listdir(current_path)))
    filtered_directories.sort(key=trailing_number)
    if len(filtered_directories) == 0:
        return 0
    else:
        return trailing_number(filtered_directories[-1])

current_path = os.path.dirname(os.path.realpath(__file__))
most_recent_day = get_most_recent_day(current_path) + 1

base_path = current_path + '/'
day_str = 'day' + str(most_recent_day)
new_path = base_path + '/' +str(day_str)
if not os.path.exists(new_path):
    os.makedirs(new_path)
    shutil.copyfile(current_path + '\\template\\template.py', new_path +'\\'+ day_str + '.py')
    shutil.copyfile(current_path + '\\template\\template.py', new_path + '\\' + 'example01.txt')
    shutil.copyfile(current_path + '\\template\\template.py', new_path + '\\' + 'example02.txt')
else:
    raise ValueError(f'Trying to create directory {base_path} but is already existing')

