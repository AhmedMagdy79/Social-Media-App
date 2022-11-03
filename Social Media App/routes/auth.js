const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const User = require("../models/user");
const isAuth = require("../middleware/is-Auth");
const authController = require("../controller/auth");

router.put(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please Enter Valid Email")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promice.reject("E-mail address already exists!");
                    }
                });
            })
            .normalizeEmail(),
        body("password").trim().isLength({ min: 5 }),
        body("name").trim().not().isEmpty(),
    ],
    authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getStatus);

router.patch(
    "/status",
    [body("status").trim().isEmpty()],
    isAuth,
    authController.updateStatus
);

module.exports = router;
