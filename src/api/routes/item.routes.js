import express from 'express'
const router = express.Router();
import { authorize
} from '../middlewares/authorize.js';

import { createItem, getItem, getSpecificItem, filterItem, regex } from "../controllers/itemController.js";

router.post('/create-Item', authorize, createItem);
router.get('/items',authorize, getItem);
router.get('/:id/item', getSpecificItem);
router.get('/filter', filterItem);
router.get('/regex', regex);

export default router;