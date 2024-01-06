import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ListingItem from './ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer:false,
        sort: 'created_at',
        order: 'desc', 
    
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    console.log(listings);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' || false,
                furnished: furnishedFromUrl === 'true' || false,
                offer: offerFromUrl === 'true' || false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
                return;
            }
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
            
        }

        fetchListings();
        
    }, [window.location.search]);


    const handleChange = (e) => {
        if(e.target.id==='all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebarData({...sidebarData, type: e.target.id});
        }
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked ||
                 e.target.checked === 'true' ? true : false});
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({ ...sidebarData, sort, order });
          }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold'>
                        Términos de búsqueda:
                    </label>
                    <input type="text" 
                    name="searchTerm" 
                    placeholder="Buscar..."
                    id='searchTerm'
                    className="border rounded-lg p-3 w-full"
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Tipo:</label>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="all" 
                        onChange={handleChange}
                        checked={sidebarData.type === 'all'}/>
                        <span>Venta y alquiler</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="rent"
                        onChange={handleChange} checked={sidebarData.type === 'rent'}
                        />
                        <span>Alquiler</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="sale" 
                        onChange={handleChange} checked={sidebarData.type === 'sale'}/>
                        <span>Venta</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="offer" 
                        onChange={handleChange} checked={sidebarData.offer}/>
                        <span>Oferta</span>
                    </div>
                    <label className='font-semibold'>Comididaes:</label>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="parking"
                        onChange={handleChange}
                        checked={sidebarData.parking}
                        />
                        <span>Estacionamiento</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="furnished"
                        onChange={handleChange} checked={sidebarData.furnished}/>
                        <span>Amueblado</span>
                    </div> 
                </div>
                <div className="flex items-center gap-2">
                    <label className='font-semibold'>
                        Ordenadar por:
                    </label>
                    <select onChange={handleChange} id="sort_order" 
                    className='border rounded-lg p-3' defaultValue={'createdAt_desc'}>
                        <option value='regularPrice_desc'>Precio del más alto al más bajo</option>
                        <option value='regularPrice_asc'>Precio del más bajo al más alto</option>
                        <option value='createdAt_desc'>Última publicación 💥</option>
                        <option value='createdAt_asc'>Más antiguos</option>
                    </select>
                </div>
                <button className='w-full bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>Buscar</button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                Publicaciones encontradas:
            </h1> 
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700 text-center w-4'>No se encontraron resultados</p>
                )}
                {loading && 
                    <p className='text-xl text-slate-700 text-center w-full'>Cargando...</p>
                }
                {
                    !loading && listings && listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                ))}
                {showMore && (
                    <button onClick={() => {
                        onShowMoreClick();
                    }} className='text-green-700 p-7 hover:underline w-full'>Mostrar más resultados</button>
                )}
                
            </div>
        </div>
    </div>
  )
}
