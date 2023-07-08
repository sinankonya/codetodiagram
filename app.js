const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle POST requests to the "/runcode" endpoint
app.post('/drawDiagram', (req, res) => {
  let data = '';

  // Collect the request data
  req.on('data', chunk => {
    data += chunk;
  });

  // Process the request data when it's complete
  req.on('end', () => {
    // Get the Python code from the request data
    const pythonCode = data.toString();

    // Genreate a unique id to use file naming
    // Assign unique File Name
    const fileName = uuid.v1();  

    // Assign a random filename in order to prevent accidentally getting other concurrent requests generated diagram (if both give the same name),
    const index = pythonCode.indexOf('Diagram');
    const index1 = pythonCode.indexOf('"', index);
    const index2 = pythonCode.indexOf('"', index1 + 1);

    const diagramName = pythonCode.substring(index1+1,index2);
    // Remove the file extentions, filename, and show flag from the given "code "

    let modifiedCode = pythonCode;

    // Remove filename attribute, we assign unique name to a file
    const regFilename = /,( *)filename( *)=( *)\"(.*)\"/g;
    modifiedCode = pythonCode.replace(regFilename, "");

    // Remove the attribute "show" (if it exists) - we will add it as False (default is True) - We don't need them to generate and display the diagram on host 
    const regShow = /,( *)show( *)=( *)(False|True)/g;
    modifiedCode = pythonCode.replace(regShow, "");

    // Compose the new modified code 
    const pythonCodeToDraw = modifiedCode.substring(0, index2 + 1) + ', show=False, filename=' + '"' + fileName + '"' + modifiedCode.substring(index2 + 1);

    // Run the Python code using spawn
    const pythonProcess = spawn('python', ['-c', pythonCodeToDraw]);

    let result = '';

    // Handle any errors that occur during the Python process
    pythonProcess.on('error', error => {
      console.error("An error occurred while runing the code!", error);
      res.status(500).json({error:"An error occurred while runing the code. " +error});
    });


    // Send the generated image file as a Stream of file
    pythonProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        console.error("`Python command exited with non-zero code: ${code}");
        res.status(500).json({ error: 'An error occurred while running the Python code'});
      } else {
        console.log('Python command executed successfully.');

        const imageStream = fs.createReadStream('./' + fileName + '.png');
        res.setHeader('Content-Type', 'image/jpeg');
        imageStream.pipe(res);
        // When the process is completed,  delete the file to prevent the host folder filling up
        imageStream.on('end', () => {
          //Delete the generated file 
          fs.unlink('./' + fileName + '.png', (err) => {
            if (err) {
              console.error('Error deleting file:', err);
              return;
            }
          });
        });
      }
    });

  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});