import * as fs from 'fs';
import { runChildProcessAsync } from './helpers';

const solutionPath = './src/solutions/';
const templateFilePath = './util/solutionTemplate.txt';
const templateRegex__DAY_NUMBER__ = /__DAY_NUMBER__/g;
const templateRegex__TITLE__ = /__TITLE__/g;
const solutionFileRegex = /day[0-9]+\.ts/;
const solutionIndexRegex = /(?<=day)([0-9]+)(?=\.ts)/;

function getNextSolutionIndex(): number {
    let maxIndex = 0;
    const files = fs.readdirSync(solutionPath);
    for (const file of files.filter(x => x.match(solutionFileRegex))) {
        solutionIndexRegex.lastIndex = 0;
        const result = solutionIndexRegex.exec(file);
        if (!result) { continue; }

        const index = parseInt(result[0]);
        if (index >= maxIndex) {
            maxIndex = index;
        }
    }

    return maxIndex + 1;
}

async function createNewSolutionFileAsync() {
    const twoDigitIndex = getNextSolutionIndex().toString().padStart(2, '0');
    const newFilePath = `${solutionPath}day${twoDigitIndex}.ts`;

    console.log(`Creating new solution file: ${newFilePath}`);
    let contents = fs.readFileSync(templateFilePath, { encoding: 'utf-8' });
    contents = contents
        .replace(templateRegex__DAY_NUMBER__, twoDigitIndex)
        .replace(templateRegex__TITLE__, `Day${twoDigitIndex}Title`);
    fs.writeFileSync(newFilePath, contents, { encoding: 'utf-8' });

    console.log('Updating solution index...');
    await runChildProcessAsync('npm run generate-index');
}

createNewSolutionFileAsync();
