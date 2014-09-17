import json
from matplotlib import pyplot as plt

data = open('data.txt')
data = json.load(data)

keys = data.keys()
length = len(data[keys[0]])

y = [0] * length

for key in keys:
  userResp = data[key]
  for i in range(len(y)):
    if userResp[i] != None:
      y[i] += int(userResp[i])


result = [y[i]/float(length) for i in range(len(y))];
print result
x = [1, 2, 3, 4, 5, 6, 7];
fig = plt.figure()
plt.xlabel("Averaged user responses");
plt.ylabel("Grades")
plt.plot(x, result)
fig.savefig("plot.jpg")
