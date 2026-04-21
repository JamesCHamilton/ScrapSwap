import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/slug/:slug', recipeController.getRecipeBySlug);
router.get('/:id', recipeController.getRecipeById);

export default router;
