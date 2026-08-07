const express = require("express");

const { 
    getAllUsers, 
    activateUser,
    updateUser,
    deleteUser 

} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["SUPER_ADMIN"]), getAllUsers);
router.patch("/:id/activate",authMiddleware,roleMiddleware(["SUPER_ADMIN"]),activateUser,);
router.put("/:id", authMiddleware, roleMiddleware(["SUPER_ADMIN"]), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware(["SUPER_ADMIN"]), deleteUser);

module.exports = router;
