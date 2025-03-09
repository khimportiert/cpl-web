import { Autocomplete, InputAdornment, TextField, createFilterOptions } from '@mui/material'
import React, { useState } from 'react'

const filter = createFilterOptions();

/**
 * value (useState), setValue (setState), label, option ( {title: "tile"} ), icon, sx
 * @param {*} props
 * @returns 
 */
const SelectWithNew = (props) => {

    const setValue = props.setValue

    const handleChange = (e, newValue) => {
        // e.preventDefault()
        if (typeof newValue === 'string') {
            setValue({
                title: newValue,
            });
        } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
            title: newValue.inputValue,
        });
        } else {
            setValue(newValue);
        }
    }

    return (
        <Autocomplete
            value={props.value}
            // onChange={handleChange}
            onInputChange={handleChange}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.title);
                if (inputValue !== '' && !isExisting) {
                filtered.push({
                    inputValue,
                    title: `"${inputValue}" Hinzufügen`,
                });
                }

                return filtered;
            }}
            clearOnBlur
            selectOnFocus
            handleHomeEndKeys
            options={props.options}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            renderOption={(props, option) => <li {...props}>{option.title}</li>}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} error={props.error} helperText={props.helperText} autoFocus={props.autoFocus} label={props.label} sx={props.sx} InputProps={{...params.InputProps, startAdornment: (<InputAdornment position="start">{props.icon}</InputAdornment>)}} variant='standard' />
            )}
    />
    )
}

export default SelectWithNew