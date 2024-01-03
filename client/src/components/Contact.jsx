import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => setMessage(e.target.value);

    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
        
    }, [listing.userRef])

  return (
    <>
        {landlord && (
            <div className="flex flex-col gap-2">
                <p>Contactá a <span className="font-semibold">{landlord.username}</span> por <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
                <textarea name='message' id='message' rows='2' value={message} onChange={onChange} placeholder='Tu consulta...'
                className='w-full px-4 p-3 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg'></textarea>
                <Link to={`mailto:${landlord.email}?Subject=Respecto de ${listing.name}&body=${message}`} 
                className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95'>Enviar mensaje</Link>
            </div>
        )}
    </>
  )
}
