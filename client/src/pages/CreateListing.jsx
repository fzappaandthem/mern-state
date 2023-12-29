import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Publicar un inmueble</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder='Nombre' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required  />
          <input type="text" placeholder='Descripción' className='border p-3 rounded-lg' id="description" required  />
          <input type="text" placeholder='Dirección' className='border p-3 rounded-lg' id="address" required  />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className='w-5'/>
              <span>Venta</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className='w-5'/>
              <span>Alquiler</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className='w-5'/>
              <span>Estacionamiento</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className='w-5'/>
              <span>Amueblado</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className='w-5'/>
              <span>Oferta</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="bedrooms" min='1' max='10' required/>
              <p>Habitaciones</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="bathrooms" min='1' max='10' required/>
              <p>Baños</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="regularPrice" min='1' max='10' required/>
              <div className="flex flex-col items-center">
                <p>Precio regular</p>
                <span className='text-sm'>($ / mensuales)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="discountPrice" min='1' max='10' required/>
              <div className="flex flex-col items-center">
                <p>Precio en oferta</p>
                <span className='text-sm'>($ / mensuales)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Imagenes:
          <span className='font-normal text-gray-600 ml-2'>La primer imágen va a ser la portada (máx 6)</span>
          </p>
          <div className="flex gap-4">
            <input className='p-3  border border-gray-300 rounded-lg w-full' type='file' id="images" accept='image/*' multiple/>
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Subir imágenes</button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase'>Publicar</button>
        </div>
      </form>
    </main>
  )
}
