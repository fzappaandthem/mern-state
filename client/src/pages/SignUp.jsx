import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password || !formData.username){
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        setLoading(false);
        const data = await res.json();
        setError(data.message);
        // const error = new Error(res.statusText);
        // throw error;
        return;
      }
      const data = await res.json();
      if(data.success===false){
        setLoading(false);
        setError(data.message);
        return;
      }
      else
      {
        setLoading(false);
        setError(null);
        navigate('/sign-in');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Creación de nuevo usuario</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='nombre de usuario' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='contraseña' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Cargando...' : 'Crear usuario'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Ya tenés una cuenta?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Iniciar sesión</span>
        </Link>
      </div>
      <p className='text-red-500 mt-5'>{error ? error : ''}</p>
    </div> 
  )
}
