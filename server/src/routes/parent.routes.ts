import { Router } from "express";

import {
  parentSignup,
  parentLogin,
} from "../controllers/parent.controller";

const router = Router();

/* ===========================
   PARENT SIGNUP
=========================== */

router.post(
  "/signup",
  parentSignup
);

/* ===========================
   PARENT LOGIN
=========================== */

router.post(
  "/login",
  parentLogin
);

export default router;