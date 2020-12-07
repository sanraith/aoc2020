import { Day07 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day07 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day07, `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`));

        it('solves part 1', expectedResult(1, '4'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day07, `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`));

        it('solves part 2', expectedResult(2, '126'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day07));
        it('solves part 1', expectedResult(1, '265'));
        it('solves part 2', expectedResult(2, '14177'));
    });
});
