import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg'>
        <Link to={`/listing/${listing._id}`}>
            <img className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300'
                src={listing.imageUrls[0] ? listing.imageUrls[0] : 'https://imageio.forbes.com/specials-images/imageserve/657b29edf09ae8354c4debba/Real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is/960x0.jpg'} alt='Portada de la publicación'/>
            <div className="p-3 flex flex-col gap-2 w-full mt-1">
                <p className='text-lg font-semibold w-full sm:w-[330px] text-slate-700 truncate'>{listing.name}</p>
                <div className="flex items-center gap-1">
                    <MdLocationOn className='h-4 w-4 text-green-700'/>
                    <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
                </div>
                <div className="">
                    <p className='text-sm text-gray-600'>{listing.type === 'rent' ? 'Alquiler' : 'Venta'}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description }</p>
                <p className='mt-2 font-semibold text-slate-500'>$
                {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US') }
                {listing.type === 'rent' ? '/mes' : ''}
                </p>
                <div className="text-slate-700 flex gap-4">
                    <div className="font-bold text-xs">
                        {listing.bedrooms} {listing.bedrooms > 1 ? 'habitaciones' : 'habitación'}
                    </div>
                    <div className="font-bold text-xs">
                        {listing.bathrooms} {listing.bathrooms > 1 ? 'baños' : 'baño'}
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
