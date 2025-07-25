/* eslint-disable no-unused-vars */
import { useState } from "react"
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


function CreateListing() {
    const [formData,setFormData] = useState({
        name:"",
        description:"",
        address:"",
        regularPrice:50,
        discountPrice:0,
        bedrooms:1,
        bathrooms:1,
        furnished:false,
        parking:false,
        type:'rent',
        offer:false,
        userRef:'',
        imageUrls:[]
    })
    const {currentUser} = useSelector((state) => state.user)
    const [files,setFiles] = useState([])
    const [uploading,setUploading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [imageUploadError,setImageUploadError] = useState('')
    const [error,setError] = useState(null)
    const navigate = useNavigate()


    const handleImageUpload = (e) => {
        e.preventDefault()
        if(files.length == 0) {
            setImageUploadError('Choose a file')
            setUploading(false);
        } else if(files.length >0 && files.length + formData.imageUrls.length <7) {
            setUploading(true)
            setImageUploadError('')
            const promises = []
            for(let i=0;i<files.length;i++) {
                promises.push(getPromise(files[i]))
            }

            Promise.all(promises)
            .then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                })

                setImageUploadError('')
                setUploading(false);
            }).catch((err) => {
                setImageUploadError("Upload failed: You can only upload images and 2 MB max per image")
                console.log("error error error")
                setUploading(false)
            })
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    }

    const getPromise = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef,file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (err) => {
                    reject(err)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        })
        
    }

    const handleRemoveImage = (index) => {
        setFormData({...formData,imageUrls:formData.imageUrls.filter((url,i) => i!==index)})
    }

    const handleChange = (e)=>{
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
              ...formData,
              type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
          ) {
            setFormData({
              ...formData,
              [e.target.id]: e.target.checked,
            });
          }
      
          if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
          ) {
            setFormData({
              ...formData,
              [e.target.id]: e.target.value,
            });
          }
    }

    const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
        if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
    
        setLoading(true);
        setError(null)
        console.log(formData)
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listing/create`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id
            })
        })

        console.log("Post request done")

        const data = await res.json()
        console.log(data)
        setLoading(false)
        if(data.success === false) {
            setError(data.message)
            return 
        }

        console.log("request succed")
        navigate(`/Listing/${data._id}`)
    } catch (error) {
        setError(error)
        setLoading(false)
    }
}
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
            Create a Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4' >
                <div className="flex flex-col gap-4 flex-1">
                    <input 
                    type="text" 
                    placeholder="Name"
                    className="border p-3 rounded-lg"
                    id="name"
                    maxLength='62'
                    minLength='10'
                    onChange={handleChange}
                    value={formData.name}
                    required
                    />
                    <textarea
                    type="text" 
                    placeholder="Description"
                    className="border p-3 rounded-lg"
                    id="description"
                    onChange={handleChange}
                    value={formData.description}
                    required
                    />
                    <input 
                    type="text" 
                    placeholder="Address"
                    className="border p-3 rounded-lg"
                    id="address"
                    onChange={handleChange}
                    value={formData.address}
                    required
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input 
                            type="checkbox" 
                            id="sale"
                            onChange={handleChange}
                            checked={formData.type === "sale"}
                            className="w-5"
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                            type="checkbox" 
                            id="rent"
                            onChange={handleChange}
                            checked={formData.type === "rent"}
                            className="w-5"
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                            type="checkbox" 
                            id="parking"
                            onChange={handleChange}
                            checked={formData.parking}
                            className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                            type="checkbox" 
                            id="furnished"
                            onChange={handleChange}
                            checked={formData.furnished}
                            className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                            type="checkbox" 
                            id="offer"
                            onChange={handleChange}
                            checked={formData.offer}
                            className="w-5"
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input 
                            type="number" 
                            id="bedrooms"
                            min='1'
                            max='10'
                            onChange={handleChange}
                            value={formData.bedrooms} 
                            className="border border-gray-300  p-3 rounded-lg"
                            />
                            <span>Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                            type="number" 
                            id="bathrooms"
                            min='1'
                            max='10'
                            onChange={handleChange}
                            value={formData.bathrooms}
                            className="border border-gray-300  p-3 rounded-lg"
                            />
                            <span>Baths</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='50'
                                max='10000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                type='number'
                                id='discountPrice'
                                min='0'
                                max='10000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                <p>Discounted price</p>

                                {formData.type === 'rent' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                        The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                        onChange={(e) => setFiles(e.target.files)}
                        className='p-3 border border-gray-300 rounded w-full'
                        type='file'
                        id='images'
                        accept='image/*'
                        multiple
                        />
                        <button
                        type='button'
                        disabled={uploading}
                        onClick={handleImageUpload}
                        className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                        {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    {
                        formData.imageUrls.length > 0 && (
                            formData.imageUrls.map((url,index) => (
                                <div key={url} className="flex justify-between border p-3 items-center">

                                    <img  src={url} alt='listing image'
                                        className='w-20 h-20 object-contain rounded-lg'/>

                                    <button
                                        type='button'
                                        onClick={() => handleRemoveImage(index)}
                                        className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                    >delete</button>
                                    
                                </div>
                            )
                        ) 
                    )}

                    <p className='text-red-700 text-sm'>
                        {imageUploadError && imageUploadError}
                    </p>

                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                    >
                        {loading ? 'Creating...' : 'Create listing'}
                    </button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing
