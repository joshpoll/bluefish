import { withBluefish, useNameList, useName } from '../bluefish';
import { Col } from '../components/Col';
import { Align, Group, Padding, Rect, Ref, Text } from '../main';
import { AlignNew } from '../components/AlignNew';
type Ingredient = {
  type: 'ingredient';
  id: number;
  name: string;
};

type Step = {
  type: 'step';
  id: number;
  name: string;
  inputs: number[];
};

type RecipeList = (Ingredient | Step)[];

type RecipeProps = {
  recipe: RecipeList;
};

const IngredientItem = withBluefish(({ ingredient }: { ingredient: Ingredient }) => {
  const rect = useName('rect');
  const text = useName('text');

  return (
    <Group>
      <Rect name={rect} fill="lightgray" stroke="black" />
      <Padding name={text} all={5}>
        <Text contents={ingredient.name} />
      </Padding>
      <AlignNew alignment="topLeft">
        <Ref to={rect} />
        <Ref to={text} />
      </AlignNew>
      <AlignNew alignment="bottomRight">
        <Ref to={rect} />
        <Ref to={text} />
      </AlignNew>
    </Group>
  );
});

export const Recipe = withBluefish(({ recipe }: RecipeProps) => {
  const ingredients = recipe.filter((item) => item.type === 'ingredient') as Ingredient[];

  const ingredientNames = useNameList(ingredients.map((item) => `ingredient-${item.id}`));

  const steps = recipe.filter((item) => item.type === 'step') as Step[];

  return (
    <Group>
      <Col alignment="center" spacing={10}>
        {ingredients.map((ingredient, i) => (
          <IngredientItem name={ingredientNames[i]} ingredient={ingredient} />
        ))}
      </Col>
      <Group>
        {steps.map((step) => (
          <Group>
            {step.inputs.map((input) => (
              <Ref to={ingredientNames[input]} />
            ))}
          </Group>
        ))}
      </Group>
    </Group>
  );
});
