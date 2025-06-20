import express from 'express';
import {verifyUser} from '../utils/verifyUser.js'
import { createListing, getListing ,deleteListing, updateListing, getListings} from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create',verifyUser,createListing)
router.delete('/delete/:id',verifyUser,deleteListing)
router.get('/getlisting/:id',getListing)
router.post('/updatelisting/:id',verifyUser,updateListing)
router.get('/getlistings',getListings)

export default router