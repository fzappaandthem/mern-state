import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import {useDispatch} from 'react-redux';
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice';
import { useSelector } from 'react-redux';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      dispatch(signInFailure('Todos los campos son obligatorios'));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch('api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        dispatch(signInFailure(data.message));
        return;
      }
      const data = await res.json();
      console.log(data);
      if(data.success===false){
        dispatch(signInFailure(data.message));
        return;
      }
      else
      {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Inicio de sesión</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='contraseña' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Cargando...' : 'Iniciar sesión'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>No tenés una cuenta?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Crear una cuenta</span>
        </Link>
      </div>
      <p className='text-red-500 mt-5'>{error ? error : ''}</p>
      
    </div> 
  )
}
