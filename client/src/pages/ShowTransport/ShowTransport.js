import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const ShowTransport = () => {
    const [transport, setTransport] = useState()
    const axiosPrivate = useAxiosPrivate()

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTransports = async () => {
            try {
                const response = await axiosPrivate.get(`/api/transports/${id}`, {
                    signal: controller.signal
                });
                isMounted && setTransport(response.data);
            } catch (err) {
                if(err?.name !== 'CanceledError')
                    console.error(err);
                // 'cause StrictMode
                if(!controller.signal.aborted)
                    navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getTransports();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [id])

  return (
    <div>
      <h1>Transport Details</h1>
      <h5>Vorname: {transport?.patient_firstname}</h5>
      <h5>Nachname: {transport?.patient_lastname}</h5>
      <br />
      <Link to='/'>Transport Liste</Link>
    </div>
  )
}

export default ShowTransport