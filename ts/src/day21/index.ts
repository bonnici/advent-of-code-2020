import { readLines } from '../lib';

const input = readLines('src/day21/input.txt');
// console.log('input', input);

class Foods {
  public foods: Food[] = [];
  public allIngredients: Set<string> = new Set();
  public allAllergens: Set<string> = new Set();
  public allergenToIngredient: Map<string, string> = new Map();
  public ingredientToAllergen: Map<string, string> = new Map();

  constructor(lines: string[]) {
    for (const line of lines) {
      this.foods.push(new Food(line, this.allIngredients, this.allAllergens));
    }
  }

  public matchAllergens(): boolean {
    for (const allergen of this.allAllergens.keys()) {
      if (this.allergenToIngredient.has(allergen)) {
        continue;
      }

      const possibleIngredientsList: Set<string>[] = [];
      const possibleIngredientsSet: Set<string> = new Set();
      for (const food of this.foods) {
        if (food.allergensSet.has(allergen)) {
          const foodIngredients = food.ingredients.filter(f => !this.ingredientToAllergen.has(f));
          possibleIngredientsList.push(new Set(foodIngredients));
          foodIngredients.forEach(i => possibleIngredientsSet.add(i));
        }
      }

      const candidates = [];
      for (const possible of possibleIngredientsSet.keys()) {
        if (possibleIngredientsList.every(s => s.has(possible))) {
          candidates.push(possible);
        }
      }

      if (candidates.length === 1) {
        this.allergenToIngredient.set(allergen, candidates[0]);
        this.ingredientToAllergen.set(candidates[0], allergen);
      }
    }

    return this.allergenToIngredient.size < this.allAllergens.size;
  }

  public part1(): number {
    let count = 0;

    for (const food of this.foods) {
      for (const ingredient of food.ingredients) {
        if (!this.ingredientToAllergen.has(ingredient)) {
          count++;
        }
      }
    }

    return count;
  }

  public part2(): string {
    const sortedAllergens = [...this.allergenToIngredient.keys()].sort((a,b) => a.localeCompare(b));
    return sortedAllergens.map(a => this.allergenToIngredient.get(a)).join(',');
  }
}

// tslint:disable-next-line:max-classes-per-file
class Food {
  public ingredients: string[];
  public ingredientsSet: Set<string>;
  public allergens: string[];
  public allergensSet: Set<string>;

  constructor(line: string, allIngredients: Set<string>, allAllergens: Set<string>) {
    const split = line.split(' (contains ');

    this.ingredients = split[0].split(' ');
    this.ingredientsSet = new Set(this.ingredients);
    this.ingredients.forEach(i => allIngredients.add(i));

    this.allergens = split[1].substr(0, split[1].length - 1).split(', ');
    this.allergensSet = new Set(this.allergens);
    this.allergens.forEach(a => allAllergens.add(a));
  }
}

const foods = new Foods(input);
// console.log('foods', foods);

let moreMatches = false;
do {
  moreMatches = foods.matchAllergens();
} while (moreMatches)

// console.log('allergenToIngredient', foods.allergenToIngredient);

console.log(`Part 1: ${foods.part1()}`);
console.log(`Part 2: ${foods.part2()}`);