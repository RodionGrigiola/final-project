import { Router } from 'express';
import furnitureController from '../Controller/furnitureController'

const router = Router();

router
    .route('/test')
    .get(furnitureController.test)


router
    .route('/furniture')
    .get(furnitureController.getFurnitureCategories)

router
    .route('/furniture/:id')
    .get(furnitureController.getPieceOfFurniture)

export default router