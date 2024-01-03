import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form className='flex flex-col gap-8'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold'>
                        Términos de búsqueda:
                    </label>
                    <input type="text" 
                    name="searchTerm" 
                    placeholder="Buscar..."
                    id='searchTerm'
                    className="border rounded-lg p-3 w-full"
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Tipo:</label>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="all" value=""/>
                        <span>Venta y alquiler</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="rent" value=""/>
                        <span>Alquiler</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="sale" value=""/>
                        <span>Venta</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="offer" value=""/>
                        <span>Oferta</span>
                    </div>
                    <label className='font-semibold'>Comididaes:</label>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="parking" value=""/>
                        <span>Estacionamiento</span>
                    </div>
                    <div className="flex gap-2">
                        <input className='w-5' type="checkbox" name="type" id="rent" value=""/>
                        <span>Amueblado</span>
                    </div> 
                </div>
                <div className="flex items-center gap-2">
                    <label className='font-semibold'>
                        Ordenadar por:
                    </label>
                    <select id="sort_order" className='border rounded-lg p-3'>
                        <option>Precio del más alto al más bajo</option>
                        <option>Precio del más bajo al más alto</option>
                        <option>Última publicación 💥</option>
                        <option>Más antiguos</option>
                    </select>
                </div>
                <button className='w-full bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>Buscar</button>
            </form>
        </div>
        <div className="">
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Publicaciones encontradas:</h1>
        </div>
    </div>
  )
}
