//Import router object to handle requests, import database model(s), and import helper function
const router = require('express').Router();
const { Recipe, User  } = require('../models');
const withAuth = require("../utils/auth");

router.get('/', async (req, res) => {
    try {
        const recipeData = await Recipe.findAll({
            include:[
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
});

    const recipes = recipeData.map((recipe) => recipe.get({plain: true}));

    res.render('homepage', {
        recipes,
        logged_in: req.session.logged_in
    });
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/recipe/:id', async (req, res) => {
    try {
        const recipeData = await Recipe.findByPk(req.params.id, {
            include: [
                {
                    module: User,
                    attributes: ['name'],
                },
            ],
        });

        const recipe = recipeData.get({ plain: true});

        res.render('recipes', {
            ...recipe,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']},
            include: [{ model: Recipe }],
        });
        console.log('working')
        const user = userData.get({ plain: true});

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
   }

});

router.get('/login', (req, res) => {

    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get("/register", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }

    res.render('register');
});

router.get('/recipes', async (req, res) => {
    try {
        const recipeData = await Recipe.findAll({
            include:[
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
});

    const recipes = recipeData.map((recipe) => recipe.get({plain: true}));

    res.render('recipes', {
        recipes,
        logged_in: req.session.logged_in
    });
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;