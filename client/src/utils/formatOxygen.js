const formatOxygen = (patient_oxygen) => {
    if(['ja','nein', 'ab Station', 'im Fahrzeug'].includes(patient_oxygen))
        return patient_oxygen
    return patient_oxygen+" l/min"
}

export default formatOxygen