import { Day21 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day21 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day21, `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`));

        it('solves part 1', expectedResult(1, '5'));
        it('solves part 2', expectedResult(2, 'mxmxvkd,sqjhc,fvjkl'));
    });

    xdescribe('for puzzle input', function () {
        beforeAll(setupSolution(Day21));
        it('solves part 1', expectedResult(1, '1885'));
        it('solves part 2', expectedResult(2, 'fllssz,kgbzf,zcdcdf,pzmg,kpsdtv,fvvrc,dqbjj,qpxhfp'));
    });
});
