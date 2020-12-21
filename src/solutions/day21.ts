import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Product = {
    ingredients: Set<string>,
    allergens: Set<string>
}

@solutionInfo({
    day: 21,
    title: 'Allergen Assessment'
})
export class Day21 extends SolutionBase {

    protected part1(): number {
        const products = this.parseProducts();
        const ingredientToAllergenMap = this.getIngredientToAllergenMap(products);

        const ingredients = _(products).flatMap(p => Array.from(p.ingredients.values())).value();
        const nonAllergens = ingredients.filter(i => !ingredientToAllergenMap.has(i));

        return nonAllergens.length;
    }

    protected part2(): string {
        const products = this.parseProducts();
        const ingredientToAllergenMap = this.getIngredientToAllergenMap(products);

        const canonicalDangerousIngredientList = Array.from(ingredientToAllergenMap.entries())
            .map(x => ({ ingredient: x[0], allergen: x[1] }))
            .sort((a, b) => a.allergen.localeCompare(b.allergen))
            .map(x => x.ingredient)
            .join(',');

        return canonicalDangerousIngredientList;
    }

    private getIngredientToAllergenMap(products: Product[]): Map<string, string> {
        const allergens = Array.from(new Set<string>(_(products).flatMap(p => Array.from(p.allergens.values())).value()).values());
        const possibleIngredientsByAllergen = new Map<string, Set<string>>(allergens.map(a => [a, new Set<string>()]));

        for (let [allergen, possibleIngredients] of possibleIngredientsByAllergen) {
            for (let product of products) {
                if (!product.allergens.has(allergen)) {
                    continue;
                }
                if (possibleIngredients.size === 0) {
                    product.ingredients.forEach(i => possibleIngredients.add(i));
                    continue;
                }

                const newIngredients = new Set<string>();
                possibleIngredientsByAllergen.set(allergen, newIngredients);
                for (let newIngredient of product.ingredients) {
                    if (possibleIngredients.has(newIngredient)) {
                        newIngredients.add(newIngredient);
                    }
                }
                possibleIngredients = newIngredients;
            }
        }

        const ingredientToAllergenMap = new Map<string, string>();
        while (possibleIngredientsByAllergen.size > 0) {
            const identifiedAllergen = Array.from(possibleIngredientsByAllergen.entries()).find(e => e[1].size === 1)[0];
            const identifiedIngredient = possibleIngredientsByAllergen.get(identifiedAllergen).values().next().value;

            ingredientToAllergenMap.set(identifiedIngredient, identifiedAllergen);
            possibleIngredientsByAllergen.delete(identifiedAllergen);

            for (let possibleIngredients of possibleIngredientsByAllergen.values()) {
                possibleIngredients.delete(identifiedIngredient);
            }
        }

        return ingredientToAllergenMap;
    }

    private parseProducts(): Product[] {
        const ingredientsRegex = /([a-z]+ ?)+(?= \()/;
        const allergensRegex = /\(contains ([a-z, ]+)\)/;

        const products: Product[] = [];
        for (let line of this.inputLines) {
            const [ingredientsStr] = ingredientsRegex.exec(line);
            const ingredients = ingredientsStr.split(' ');
            const [, allergensStr] = allergensRegex.exec(line);
            const allergens = allergensStr.split(', ');
            products.push({
                ingredients: new Set(ingredients),
                allergens: new Set(allergens)
            });
        }

        return products;
    }
}
