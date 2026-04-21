import { Router } from 'express';
import * as listingController from '../controllers/listingController.js';

const router = Router();

router.get('/', listingController.getListings);
router.get('/:id', listingController.getListingById);
router.post('/', listingController.createListing);
router.put('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

export default router;
