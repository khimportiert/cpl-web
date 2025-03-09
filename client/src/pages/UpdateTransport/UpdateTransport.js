import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UpdateTransport = (props) => {
    const [transport, setTransport] = useState({
        patient_firstname: '',
        patient_lastname: ''
    })

    const { id } = useParams()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        axiosPrivate.get(`api/transports/${id}`)
            .then((res) => {
                setTransport({
                patient_firstname: res.data.patient_firstname,
                patient_lastname: res.data.patient_lastname
                })
            })
            .catch((err) => {
                console.error('Error in UpdateTransport.js')
            })
    }, [id])

    const onChange = (e) => {
        setTransport({ ...transport, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
    e.preventDefault()

    const data = {
    patient_firstname: transport.patient_firstname,
    patient_lastname: transport.patient_lastname
    }

    axiosPrivate.put(`/api/transports/${id}`, data)
        .then((res) => {
            navigate(`/show-transport/${id}`)})
        .catch((err) => {
            console.error('Error in UpdateTransport.js')
        })
  }

  return (
    <div>
      <h1>Transport ändern</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="patient_firstname">Vorname</label>
        <input type="text" name='patient_firstname' value={transport.patient_firstname} onChange={onChange}/>
        <label htmlFor="patient_firstname">Nachname</label>
        <input type="text" name='patient_lastname' value={transport.patient_lastname} onChange={onChange}/>
        <input type="submit" />u
      </form>
      <Link to='/'>Transport Liste</Link>
    </div>
  )
}

export default UpdateTransport