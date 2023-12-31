## The Code To Diagram App

The codetodiagram app lets you draw a system architecture diagram by providing a Python Code. The 

- Gets Diagrams code (https://diagrams.mingrammer.com/) from user 
- The code modify the given code
  - set the "show" attribute to False not to display the generated image at the server 
  - gives a different unique file name to the generated file. There can be a probability that two users can be send the same filename (or diagram name) at same time and the app stream wrong image to the user (very low possibility)
   
- Runs the Python code at serverside. Which generates the image file based on the input 
- Stream down the generated diagram image to the user
- The server side code deletes the generated image from the host to prevent storage fillup
- User can download and save the generated image

## Requirements

* Node   (https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Python 3.6 or higher   (https://python.land/installing-python)
* Diagrams  (https://diagrams.mingrammer.com/)
* Graphviz  (https://graphviz.gitlab.io/download/)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/sinankonya/codetodiagram.git
cd codetodiagram
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
node app.js
```

Open http://localhost:3000

## Usage
Enter the code below to the text area and click Draw button

```bash
from diagrams import Diagram
from diagrams.aws.compute import EC2
from diagrams.aws.database import RDS
from diagrams.aws.network import ELB

with Diagram("Grouped Workers", show=False, direction="TB"):
    ELB("lb") >> [EC2("worker1"),
                 EC2("worker2"),
                 EC2("worker3"),
                 EC2("worker4"),
                 EC2("worker5")] >> RDS("events")
```




## Use Docker
You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/sinankonya/codetodiagram.git
cd codetodiagram
```

Step 2: Build the Docker image

```bash
docker build -t codetodiagram .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 3000:3000 -d codetodiagram
```

