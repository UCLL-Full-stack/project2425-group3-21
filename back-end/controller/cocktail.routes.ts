import express, { Router, Request, Response, NextFunction } from "express";
import cocktailService from "../service/cocktail.service";

const cocktailRouter = express.Router();

/**
 * @swagger
 * /cocktails:
 *   get:
 *     summary: Get a list of all cocktails.
 *     responses:
 *       200:
 *         description: A list of cocktails.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Cocktail'
 */
cocktailRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cocktails = await cocktailService.getAllCocktails();
        res.status(200).json(cocktails);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cocktails/{id}:
 *  get:
 *      summary: Get a cocktail by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The cocktail id.
 *      responses:
 *          200:
 *              description: A cocktail object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Cocktail'
 */
cocktailRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cocktail = await cocktailService.getCocktailById({ id: Number(req.params.id) });
        res.status(200).json(cocktail);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cocktails:
 *   post:
 *     summary: Add a new cocktail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mojito"
 *               description:
 *                 type: string
 *                 example: "A refreshing Cuban cocktail with lime, mint, and rum."
 *               strongness:
 *                 type: integer
 *                 example: 3
 *               image:
 *                 type: string
 *                 example: "/placeholder.png"
 *               authorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: The cocktail has been added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredient_id:
 *                   type: integer
 *                   description: The unique identifier for the cocktail.
 *                 name:
 *                   type: string
 *                   description: The name of the cocktail.
 *       400:
 *         description: Invalid input.
 */
cocktailRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, strongness, image, authorId} = req.body;

        if (!name || !description || strongness === undefined || !image) {
            return res.status(400).json({ message: 'All fields are required: name, description, strongness, image.' });
        }

        const newCocktail = cocktailService.addCocktail({ name, description, strongness, image , authorId});
        res.status(201).json(newCocktail);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /cocktails/{id}:
 *   delete:
 *     summary: Delete a cocktail by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cocktail id.
 *     responses:
 *       200:
 *         description: The cocktail has been deleted.
 *       404:
 *         description: Cocktail not found.
 */
cocktailRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await cocktailService.deleteCocktail(Number(id));
        res.status(200).json({ message: 'Cocktail deleted successfully.' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cocktails/{id}:
 *   put:
 *     summary: Update a cocktail by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cocktail id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mojito"
 *               description:
 *                 type: string
 *                 example: "A refreshing Cuban cocktail with lime, mint, and rum."
 *               strongness:
 *                 type: integer
 *                 example: 3
 *               image:
 *                 type: string
 *                 example: "/placeholder.png"
 *               authorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: The cocktail has been updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredient_id:
 *                   type: integer
 *                   description: The unique identifier for the cocktail.
 *                 name:
 *                   type: string
 *                   description: The name of the cocktail.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Cocktail not found.
 */
cocktailRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description, strongness, image, authorId } = req.body;

        if (!name || !description || strongness === undefined || !image) {
            return res.status(400).json({ message: 'All fields are required: name, description, strongness, image.' });
        }

        const updatedCocktail = await cocktailService.updateCocktail({ id: Number(id), name, description, strongness, image , authorId});
        res.status(200).json(updatedCocktail);
    } catch (error) {
        next(error);
    }
});

export { cocktailRouter };

