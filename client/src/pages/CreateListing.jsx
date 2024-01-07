import React from 'react'
import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../firebase';
import {useSelector} from 'react-redux'; 
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const {currentUser} = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleImageSubmit = (e) => {
    setUploading(true);
    setImageUploadError(false);
    if(files.length > 0 && files.length + formData.imageUrls.length < 7 ){
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls)=>{
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUploading(false);
      }).catch((error)=>{
        setImageUploadError('Falló la subida del archivo (2mb máx por archivo)');
        setUploading(false);
      })

    }else{
      setImageUploadError('Se pueden subir sólo 6 imágenes por publicación');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress=(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Se subió el ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          })
        }
      )
    })
  }
  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({...formData, type: e.target.id});
    }
    if(e.target.id==='parking' || e.target.id==='furnished' ||  e.target.id==='offer'){
      setFormData({...formData, [e.target.id]: e.target.checked});
    }

    if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
      setFormData({...formData, [e.target.id]:e.target.value});
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1)
        return setError('Tenés que subir al menos una imagen');
      if(+formData.regularPrice <= +formData.discountPrice)
        return setError('El precio de oferta debe ser menor que el precio original');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        })
      });
      const data = await res.json();
      setLoading(false);
      if(!res.ok){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Publicar un inmueble</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder='Título' className='border p-3 rounded-lg' id="name" onChange={handleChange} value={formData.name}  maxLength='62' minLength='10' required  />
          <textarea type="text" placeholder='Descripción' className='border p-3 rounded-lg' id="description" onChange={handleChange} value={formData.description} required  />
          <input type="text" placeholder='Dirección' className='border p-3 rounded-lg' id="address" onChange={handleChange} value={formData.address} required  />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" onChange={handleChange} checked={formData.type === 'sale'} className='w-5'/>
              <span>Venta</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" onChange={handleChange} checked={formData.type === 'rent'} className='w-5'/>
              <span>Alquiler</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" onChange={handleChange} checked={formData.parking} className='w-5'/>
              <span>Estacionamiento</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" onChange={handleChange} checked={formData.furnished} className='w-5'/>
              <span>Amueblado</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" onChange={handleChange} checked={formData.offer} className='w-5'/>
              <span>Oferta</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="bedrooms" onChange={handleChange} value={formData.bedrooms} min='1' max='10' required/>
              <p>Habitaciones</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="bathrooms" onChange={handleChange} value={formData.bathrooms} min='1' max='10' required/>
              <p>Baños</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input type="number" className='border p-3 border-gray-300 rounded-lg' id="regularPrice" onChange={handleChange} value={formData.regularPrice} min='50' max='1000000' required/>
              <div className="flex flex-col items-center">
                <p>Precio regular</p>
                <span className='text-sm'>($ / mensuales)</span>
              </div>
            </div>
            {formData.offer &&
              <div className="flex items-center gap-2 ">
                <input type="number" className='border p-3 border-gray-300 rounded-lg' id="discountPrice" onChange={handleChange} value={formData.discountPrice} min='50' max='1000000' required/>
                <div className="flex flex-col items-center">
                  <p>Precio en oferta</p>
                  <span className='text-sm'>($ / mensuales)</span>
                </div>
              </div>
            
            }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Imagenes:
          <span className='font-normal text-gray-600 ml-2'>La primer imágen va a ser la portada (máx 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e) => setFiles(e.target.files) } 
            className='p-3  border border-gray-300 rounded-lg w-full' 
            type='file' id="images" accept='image/*' multiple/>
            <button type='button' onClick={handleImageSubmit} 
            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Cargando...' : 'Subir imágenes'}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  eliminar
                </button>
              </div>
            ))}
          <button disabled={loading ||uploading } className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase'>{loading ?'Creando publicación...':'Publicar'}</button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  )
}
