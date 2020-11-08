const fs = require('fs');
const childProcess = require('child_process');
const deployDir = 'docs';

async function runChildProcessAsync(command: string) {
    return new Promise((resolve, _) => {
        const child = childProcess.exec(command);
        child.stdout.pipe(process.stdout);
        child.on('exit', () => resolve());
    });
}

async function deployAsync() {
    console.log(`Clearing ./${deployDir}...`);
    fs.rmdirSync(deployDir, { recursive: true });
    fs.mkdirSync(deployDir);

    console.log(`Building website...`);
    await runChildProcessAsync(`ng build --prod --outputPath ${deployDir}`);

    console.log('Deployment finished.');
}

deployAsync();
