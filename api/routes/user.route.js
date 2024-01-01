import express from "express";
import { test, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifiUser.js";
import { deleteUser, getUserListings } from "../controller/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);



export default router;