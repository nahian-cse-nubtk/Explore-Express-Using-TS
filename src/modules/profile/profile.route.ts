import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router()

router.post('/',profileController.createProfile)
router.get('/',profileController.getAllProfileData)
router.get('/:id',profileController.getSingleProfileData)
export const profileRoute = router;