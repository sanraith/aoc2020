import { runChildProcessAsync } from './helpers';
import * as fs from 'fs';

const deployDir = 'docs';
const baseHref = 'https://sanraith.github.io/aoc2020/';

async function deployAsync() {
    console.log(`Clearing ./${deployDir}...`);
    fs.rmdirSync(deployDir, { recursive: true });

    console.log(`Building website...`);
    await runChildProcessAsync(`ng build --prod --base-href "${baseHref}" --outputPath ${deployDir}`);

    console.log(`Adding ${deployDir}/.nojekyll for github pages...`);
    fs.closeSync(fs.openSync(`${deployDir}/.nojekyll`, 'w'));

    console.log('Deployment finished.');
}

deployAsync();
