import { Day24 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day24 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day24, `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`));

        it('solves part 1', expectedResult(1, '10'));
        it('solves part 2', expectedResult(2, '2208'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day24));
        it('solves part 1', expectedResult(1, '307'));
        it('solves part 2', expectedResult(2, '3787'));
    });
});
