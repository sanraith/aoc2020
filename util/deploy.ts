import { runChildProcessAsync } from './helpers';
import { promises as fsAsync } from 'fs';

const deployDir = 'docs';
const baseHref = 'https://sanraith.github.io/aoc2020/';

async function deployAsync() {
    console.log(`Clearing ./${deployDir}...`);
    await fsAsync.rmdir(deployDir, { recursive: true });

    console.log(`Building website...`);
    await runChildProcessAsync(`ng build --prod --base-href "${baseHref}" --outputPath ${deployDir}`);

    console.log(`Adding ${deployDir}/.nojekyll for github pages...`);
    await fsAsync.writeFile(`${deployDir}/.nojekyll`, '', { encoding: 'utf-8' });

    console.log('Deployment finished.');
}

deployAsync();
