import * as childProcess from 'child_process';

export async function runChildProcessAsync(command: string, pipeOutput?: boolean) {
    pipeOutput = pipeOutput ?? true;
    return new Promise((resolve, _) => {
        const child = childProcess.exec(command);
        if (pipeOutput) { child.stdout.pipe(process.stdout); }
        child.on('exit', () => resolve());
    });
}
