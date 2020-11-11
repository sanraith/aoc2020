import * as childProcess from 'child_process';

export async function runChildProcessAsync(command: string) {
    return new Promise((resolve, _) => {
        const child = childProcess.exec(command);
        child.stdout.pipe(process.stdout);
        child.on('exit', () => resolve());
    });
}
