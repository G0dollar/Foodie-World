/* Pure calculations: ingredient density is required for mass/volume conversion. */
const FoodieConversions = Object.freeze({
  mass(value, gramsPerCup, direction) {
    if (!Number.isFinite(value) || value < 0) throw new Error('Enter an amount of zero or more.');
    if (!Number.isFinite(gramsPerCup) || gramsPerCup <= 0) throw new Error('Choose a valid ingredient.');
    let result;
    if (direction === 'cups-to-grams') result = value * gramsPerCup;
    else if (direction === 'grams-to-cups') result = value / gramsPerCup;
    else throw new Error('Choose a valid conversion.');
    if (!Number.isFinite(result)) throw new Error('That amount is too large to convert.');
    return result;
  },
  temperature(value, direction) {
    if (!Number.isFinite(value)) throw new Error('Enter a valid temperature.');
    let result;
    if (direction === 'c-to-f') {
      if (value < -273.15) throw new Error('Temperature cannot be below −273.15 °C.');
      result = value * 9 / 5 + 32;
    } else if (direction === 'f-to-c') {
      if (value < -459.67) throw new Error('Temperature cannot be below −459.67 °F.');
      result = (value - 32) * 5 / 9;
    } else throw new Error('Choose a valid conversion.');
    if (!Number.isFinite(result)) throw new Error('That temperature is too large to convert.');
    return result;
  }
});
const INGREDIENT_WEIGHTS = Object.freeze({"flour": {"name": "All-purpose flour", "grams": 120}, "sugar": {"name": "Granulated white sugar", "grams": 198}, "brown-sugar": {"name": "Packed brown sugar", "grams": 213}, "cocoa": {"name": "Unsweetened cocoa powder", "grams": 84}, "almond": {"name": "Almond flour", "grams": 96}});
