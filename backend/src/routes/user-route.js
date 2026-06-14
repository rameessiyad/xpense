const router = require("express").Router();
const {
  getMe,
  registerUser,
  login,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/user-controller");
const { protect } = require("../middleware/auth-middleware");

//public routes
router.post("/register", registerUser);
router.post("/login", login);

//private routes
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
