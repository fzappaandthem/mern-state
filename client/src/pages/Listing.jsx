import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
//7:42:44 muestra la imagen en el listing de la publi

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    useEffect(()=>{
        const fetchListing = async ()=>{
            try {
                setLoading(true);
                const listingId = params.listingId;
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();
                if(!res.ok){
                    setError(true);
                    setLoading(false);
                    console.log(data.message);
                    return;
                }
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    console.log(data.message);
                    return;
                }      
                setError(false);
                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
                
            }
        }
        fetchListing();
    }, [params.listingId])
  return (
    
    <main>
        {loading && <p className='text-center my-7 text-2xl'>"Cargando..."</p>}
        {error && <p className='text-center text-red-700 my-7 text-2xl'>Algo salió mal</p>}
        {listing && !loading && !error && (
            
            <Swiper navigation>
                {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[550px]' 
                        style={{background:`url(${url}) center no-repeat`,
                         backgroundSize:'cover'}}></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            
        )}   
        
    </main>
  )
}