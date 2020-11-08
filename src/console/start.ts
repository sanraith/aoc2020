import Debug from 'debug';
import Day01 from '../solutions/day01';
const debug = Debug('aoc2020:console');

debug('Console runner working!');

async function app() {
    try {
        const day01 = new Day01();
        day01.init('test input');

        const state = await day01.part1Async().toPromise();
        switch (state.type) {
            case 'result':
                debug(`Result: ${state.result}`);
                break;
            case 'error':
                debug(`Error: ${state.message}`);
                break;
        }
    } catch (e) {
        debug(`Error: ${e}`);
    }
}

app();
