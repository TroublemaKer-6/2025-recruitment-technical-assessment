import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

type fullRecipe = (recipe | ingredient) [];
// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = null;

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  // all hyphens and underscores to whitespaces
  recipeName = recipeName.replace(/[-_]/g, ' ');
  // remove those characters neither letters nor whitespaces
  recipeName = recipeName.replace(/[^a-zA-z\s]/g, '');
  // captitalise the first character and all other letters should be in lowercases
  recipeName = recipeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  // only one whitespace between two words and no leading and trailing spaces
  recipeName =  recipeName.trim().replace(/\s+/g, ' ');
  return recipeName.length > 0 ? recipeName : null;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = req.body;
  // type checking
  if (entry.type != "recipe" && entry.type != "ingredient") 
    return res.status(400).send("type can only be \"recipe\" or \"ingredient\"");
  // name has been used
  else if (cookbook.has(entry.name)) 
    return res.status(400).send("this entry name has been used");
  // invalid cooking time
  else if (entry.type === "ingredient" && entry.cookTime < 0)
    return res.status(400).send("cookTime can only be greater than or equal to 0");
  // have duplicated item names in requiredItems
  else if (entry.type === "recipe") {
    const nameExist = new Set<string>();
    for (const it of entry.requiredItems) {
      if (nameExist.has(it)) return res.status.send("duplicated names exist in requiredItems");
      else nameExist.add(it);
    }
  }
  // all good
  cookbook.set(entry.name, entry)
  return res.status(200).send();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  const recipeName: string = req.query.name as string;
  const recipeFound = cookbook.find((e: recipe | ingredient) => e.name === recipeName);

  if (!recipeFound)
    return res.status(400).send("A recipe with the corresponding name cannot be found"); 
  else if (recipeFound.type != "recipe")
    return res.status(400).send("The searched name is NOT a recipe name.");
  
  const fullRecipeRes: fullRecipe | null = fullRecipeSearching(recipeFound);
  if (!fullRecipeRes) {
    return res.status(400).send("The recipe contains recipes or ingredients that aren't in the cookbook.");
  }

  return res.status(200).json(fullRecipeRes);
});

function fullRecipeSearching(recipeToSearch: recipe): fullRecipe | null {
  const visitedRecipes = new Set<string>();
  const visitedIngredients = new Set<string>();
  const res: fullRecipe = [];
  // TODO to be implemented
  function processRecipe(curr: recipe): boolean {
    return;
  }
}

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
