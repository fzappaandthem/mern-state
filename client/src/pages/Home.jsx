import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "./ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res= await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }  
    }

    const fetchRentListings = async () => {
      try {
        const res= await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }  
    }

    const fetchSaleListings = async () => {
      try {
        const res= await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }  
    }

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top page  */}
      <div className="flex flex-col gap-6 p-28 px-3">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          La casa <span className="text-slate-500">perfecta</span><br/> te está esperando
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Francesca Propiedades es el mejor lugar para que encuentres la casa que querés. <br/>
          Tenemos una gran variedad de propiedades para que elijas.
        </div>
        <Link to={'/search'} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Vamos a encontrarla...
        </Link>
      </div>
      
      {/*  swiper  */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 &&
            offerListings.map((listing) => (
            <SwiperSlide>
              <div 
                style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, 
                backgroundSize: 'cover'}} className="h-[500px]" key={listing._id}>
              </div>
            </SwiperSlide>
            ))
        }
      </Swiper>
   
      
      {/*  Listing results for offer, sale and rent  */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Últimas ofertas</h2>
                <Link className='text-sm text-color-800 hover:underline' to={'/search?offer=true'} >
                  Mostrar más ofertas...
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>

            </div>
          )}
        {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Últimas propiedades para alquilar</h2>
                <Link className='text-sm text-color-800 hover:underline' to={'/search?type=rent'} >
                  Mostrar más alquileres...
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
          {saleListings && saleListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Últimas propiedades a la venta</h2>
                  <Link className='text-sm text-color-800 hover:underline' to={'/search?type=sale'} >
                    Mostrar más propiedades en venta...
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    saleListings.map((listing) => (
                      <ListingItem key={listing._id} listing={listing} />
                    ))
                  }
                </div>
              </div>
            )}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
