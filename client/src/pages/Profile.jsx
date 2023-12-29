import {useSelector} from 'react-redux'
import {useRef, useState, useEffect} from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from '../firebase';
import {deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserSuccess, deleteUserFailure} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector ((state) => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();



  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error)=>{
        setFileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        });
      }
    );

  };

  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if(!res.ok){
        const data = await res.json();
        dispatch(updateUserFailure(data.message));
        return;
      }
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {
     try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        if(!res.ok){
          const data = await res.json();
          dispatch(deleteUserFailure(data.message));
        }
        const data = await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
     } catch (error) {
        dispatch(deleteUserFailure(error.message));
     }
  }

  return (
    
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Perfil</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} hidden type='file' ref={fileRef} accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="perfil" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p>
          {fileUploadError ? (
            <span className='text-red-700'>Error al subir archivo (la imagen debe ser menor a 2MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Subiendo archivo... ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Imagen subida correctamente</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" placeholder='Nombre de usuario' id='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" placeholder='correo electrónico' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" placeholder='contraseña' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'cargando...' : 'actualizar'}</button>
      </form>
      <div className='flex justify-between mt-5'>
      <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Eliminar cuenta</span>
        <span className='text-red-700 cursor-pointer'>Cerrar sesión</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Cuenta actualizada correctamente' : ''}</p>
    </div>
  )
}


