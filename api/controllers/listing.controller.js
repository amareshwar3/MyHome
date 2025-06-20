import Listing from '../models/listing.model.js'

export const createListing = async(req,res,next) => {
    try {
        const listing = await Listing.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        next(error);
    }
}

export const getListing = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)

        if(!listing) {
            res.status(404).json('Listing not found')
        }

        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if(!listing) {
        res.status(404).json('Listing not found')
    }

    if(req.user.id !== listing.userRef){
        res.status(401).json('You can only delete your own listing')
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing deleted Successfully')
    } catch (error) {
        next(error)
    }
}

export const updateListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if(!listing) {
        res.status(404).json('Listing not found')
    }

    if(req.user.id !== listing.userRef){
        res.status(401).json('You can only update your own listing')
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    name:req.body.name,
                    description:req.body.description,
                    address:req.body.address,
                    regularPrice:req.body.regularPrice,
                    discountPrice:req.body.discountPrice,
                    bedrooms:req.body.bedrooms,
                    bathrooms:req.body.bathrooms,
                    furnished:req.body.furnished,
                    parking:req.body.parking,
                    type:req.body.type,
                    offer:req.body.offer,
                    userRef:req.body.userRef,
                    imageUrls:req.body.imageUrls
                },
            },
            {new: true}
        )

        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}

export const getListings = async(req,res,next) => {
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0
        let offer = req.query.offer

        if(offer === undefined || offer === 'false') {
            offer = {$in: [true, false]}
        }

        let furnished = req.query.furnished

        if(furnished === undefined || furnished === 'false') {
            furnished = {$in: [true, false]}
        }

        let parking = req.query.parking

        if(parking === undefined || parking === 'false') {
            parking = {$in: [true, false]}
        }

        let type = req.query.type

        if(type === undefined || type === 'all') {
            type = {$in: ['rent','sale']}
        }

        let searchTerm = req.query.searchTerm || ''
        
        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name : {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,

        })
        .sort({[sort]: order})
        .limit(limit)
        .skip(startIndex)

        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}