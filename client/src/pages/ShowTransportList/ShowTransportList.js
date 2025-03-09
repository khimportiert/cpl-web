import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const ShowTransportList = (props) => {
    const [transports, setTransports] = useState([])
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTransports = async () => {
            try {
                const response = await axiosPrivate.get(`/api/transports`, {
                    signal: controller.signal
                });
                isMounted && setTransports(response.data);
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
    }, [])

    const transportList =
        transports.length === 0
        ? 'there ist no transport record'
        : transports.map((transport, k) => <li key={k}>{transport.patient_firstname} {transport.patient_lastname} <Link to={`show-transport/${transport._id}`}>Details</Link> <Link to={`/edit-transport/${transport._id}`}>Ändern</Link></li>)
    
    return (
        <div>
            <h1>Transport Liste</h1>
            <ul>
                {transportList}
            </ul>
            <br />
            <Link to='/create-transport'>Transport hinzufügen</Link>
            <br />
            <Link to='/login'>Einloggen</Link>
            <br />
            <Link to='/logout'>Ausloggen</Link>
        </div>
    )
}

export default ShowTransportList