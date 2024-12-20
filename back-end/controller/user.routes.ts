import { Router, Request, Response, NextFunction } from "express";
import userService from "../service/user.service";
import { AuthenticationResponse, UserInput } from "../types/types";
const userRouter = Router();

/**
 * @swagger
 * /users/getall:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Fetch all users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the user.
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                   email:
 *                     type: string
 *                     description: The email address of the user.
 *                   password:
 *                     type: string
 *                     description: The password of the user.
 *       500:
 *         description: Server error.
 */
userRouter.get('/getall', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/findbyid/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Get a specific user based on their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: The user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the user.
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                 password:
 *                   type: string
 *                   description: The password of the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
userRouter.get('/findbyid/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// /**
//  * @swagger
//  * /users/signup:
//  *   post:
//  *     summary: Create a new user
//  *     description: Add a new user to the database.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: The name of the new user.
//  *               email:
//  *                 type: string
//  *                 description: The email address of the new user.
//  *               password:
//  *                 type: string
//  *                 description: The password of the new user.
//  *     responses:
//  *       201:
//  *         description: User created successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                   description: The unique ID of the user.
//  *                 name:
//  *                   type: string
//  *                   description: The name of the user.
//  *                 email:
//  *                   type: string
//  *                   description: The email address of the user.
//  *                 password:
//  *                   type: string
//  *                   description: The password of the user.
//  *       400:
//  *         description: Bad request.
//  *       500:
//  *         description: Server error.
//  */
// userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userData = req.body;
//         const newUser = await userService.createUser(userData);
//         res.status(201).json(newUser);
//     } catch (error) {
//         next(error);
//     }
// });



/**
 * @swagger
 * /users/login:
 *      post:
 *          summary: Login using Email & password. Returns an object with JWT token and user name when successful.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthenticationRequest'
 *          responses:
 *              200:
 *                  description: Authentication response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/AuthenticationResponse'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
    const userInput = req.body;
    const response = await userService.authenticate(userInput);
    res.status(200).json({ message: 'Authentication successful', response });
    } catch (error) {
    next(error);
    }
 })

 /**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token.
 *     description: Authenticates a user by verifying their credentials and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: A JWT token and user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       401:
 *         description: Invalid username or password.
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the credentials from the request body
        const { email, password }: UserInput = req.body;

        // Check that both username and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Call the authenticate method from the service layer
        const authResponse: AuthenticationResponse = await userService.authenticate({
            email,
            password
        });

        // Send a success response with the authentication token
        res.status(200).json(authResponse);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
});

export default userRouter;
