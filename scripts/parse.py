import os
import glob
import json

config_file = "../../project/deeplearningMentor/model/runDeep.py"

with open(config_file) as f:
	lines = f.readlines()

	n_hidden = int(lines[3].split()[2])
	n_steps = int(lines[4].split()[2])
	
	lambda_str = lines[6].split()[2]
	p_lambda = float(lambda_str[1:len(lambda_str)-1])
	alpha_str = lines[7].split()[2]
	p_alpha = float(alpha_str[1:len(alpha_str)-1])
	
	prefix_str = lines[8].split()[2]
	prefix = prefix_str[1:len(prefix_str)-1]
	nonLinear_str = lines[9].split()[2]
	nonLinear = nonLinear_str[1:len(nonLinear_str)-1]

	print n_steps, n_hidden, p_lambda, p_alpha, prefix, nonLinear

directory = prefix+"_"+str(n_hidden)+"_"+str(n_steps)+"_"+str(p_lambda)+"_"+str(p_alpha)+"_"+str(nonLinear)
if not os.path.exists(directory):
    os.makedirs(directory)

# groundTruth file
path = prefix+"*groundTruth.txt"
for filename in glob.glob(path):
	with open(filename, 'r') as f:
		rank = "".join(f.readlines())
		rank = rank[:-1]
		rank = rank.split()[1:]
			
json_rank = []
for r,i in enumerate(rank):
	person = {}
	person['index'] = i
	person['rank'] = r
	json_rank.append(person)

with open(directory+'/groundTruth.json', 'w') as outfile:  
    json.dump(json_rank, outfile, indent=4)

# predict file
path = prefix+"*predict.txt"
predict = []
temp = {}
i = -1
for filename in glob.glob(path):
	with open(filename, 'r') as f:
		for line in f:
			if line.split()[0] == "step:":
				predict.append(temp)
				i = -1
				temp = {}
				temp['step'] = int(line.split()[1])
				temp['probs'] = []
			else:
				i += 1
				person = {}
				person['index'] = i
				prob = line.split()[1][:-1]
				if prob[-1] == ']':
					prob = prob[:-1]
				prob = float(prob)
				if prob > 1.0:
					prob = 1.0
				person['prob'] = prob
				temp['probs'].append(person)

with open(directory+'/predict.json', 'w') as outfile:  
    json.dump(predict[1:], outfile, indent=4)

# results file
lastname_set = {"groundTruth", "predict", "weight"}
path = prefix+"*.txt"
results = []
for filename in glob.glob(path):
	lastname = filename.split(".")[-2]
	if lastname not in lastname_set:
		with open(filename, 'r') as f:
			for line in f.readlines()[1:]:
				result_values = line.split()
				result = {}
				result['iteration'] = int(result_values[0])
				result['trainCost'] = float(result_values[1])
				result['trainIndex'] = float(result_values[2])
				result['weightSize'] = float(result_values[3])
				results.append(result)

with open(directory+'/results.json', 'w') as outfile:  
    json.dump(results, outfile, indent=4)
	
# weight file
path = prefix+"*weight.txt"
weights = []
temp = {}
i = -1
current = 1
for filename in glob.glob(path):
	with open(filename, 'r') as f:
		for line in f:
			if line.split()[0] == "step:":
				weights.append(temp)
				i = -1
				temp = {}
				temp['step'] = int(line.split()[1])
				#temp['probs'] = []
			elif line.split()[0] == "w1:":
				if 'w2' in temp:
					temp['w2'].append(w2)
				temp['w1'] = []
				w1 = []
				current = 1
			elif line.split()[0] == "w2:":
				temp['w1'].append(w1)
				temp['w2'] = []
				w2 = []
				current = 2
			else:
				i += 1
				if current == 1:
					element = line.split()[-1][:-1]
					if len(element) == 0:
						element = line.split()[-2][:-1]
					if len(element) == 1:
						element = line.split()[-2]
					if element[-1] == ']':
						element = element[:-1]
					if element[0] == '[':
						element = element[1:]
					w1.append(float(element))
				else:
					append_flag = 0
					element = line.split()
					if element[0] == '[' or element[0] == '[[':
						element = element[1:]
					elif element[-1][-2] == ']':
						element[-1] = element[-1][:-2]
						append_flag = 1
					elif element[-1][-1] == ']':
						element[-1] = element[-1][:-1]
						append_flag = 1
					element = [float(elem) for elem in element]
					w2.extend(element)
					if append_flag == 1:
						#print w2
						temp['w2'].append(w2)

with open(directory+'/weights.json', 'w') as outfile:  
    json.dump(weights, outfile, indent=4)

'''
reads parameters from config file
make new directory with param
find and open the 4 files

show each file original and json format




'''




