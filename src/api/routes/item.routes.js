import express from 'express'
const router = express.Router();
import { authorize
} from '../middlewares/authorize.js';

import { createItem, getItem, getSpecificItem, filterItem, regex } from "../controllers/itemController.js";

router.post('/create-Item', createItem);
router.get('/items', getItem);
router.get('/:id/item', getSpecificItem);
router.get('/filter', filterItem);
router.get('/regex', regex);

export default router;