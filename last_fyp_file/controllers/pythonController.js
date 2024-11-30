const { spawn } = require('child_process');
const path = require('path');

const runPythonScript = (req, res) => {
  const pythonPath = 'C:\\Users\\zainab yousaf\\miniconda3\\envs\\myenv\\python.exe';
  const pythonScript = path.resolve(__dirname, 'train_ai.py'); // Resolve path dynamically
  const workingDir = __dirname; // Ensure Python script runs in the correct directory

  console.log(`Running Python script at: ${pythonScript}`);
  console.log(`Setting working directory to: ${workingDir}`);

  const pythonProcess = spawn(pythonPath, [pythonScript], { cwd: workingDir }); // Pass cwd option

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log('Python Output:', data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error('Python Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
        const cleanedOutput = output
            .trim()
            .replace(/\r/g, '') // Remove \r characters
            .replace(/\n/g, ' '); // Replace \n with a space or remove it

        res.status(200).send(cleanedOutput); // Send cleaned output as plain text
    } else {
        const cleanedError = errorOutput.trim().replace(/\r/g, '').replace(/\n/g, ' ');
        res.status(500).send(cleanedError); // Send cleaned error as plain text
    }
});


};

module.exports = { runPythonScript };
