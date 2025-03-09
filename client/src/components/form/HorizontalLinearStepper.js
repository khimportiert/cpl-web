import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';

export default function HorizontalLinearStepper(props) {

    const steps = props.steps;
    const step_button_labels = props.button_labels;
    const activeStep = props.activeStep
    const onNext = props.onNext
    const onBack = props.onBack

    const handleNext = () => {
        onNext()
    };

    const handleBack = () => {
        onBack()
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box width={'50%'}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                </Box>
                <Box
                    component="img"
                    sx={{
                    width: 150,
                    }}
                    alt="clinic-logo"
                    src={require(`../../assets/img/${props.facility_name}.png`)}
                />
            </Box>

            {/* <Divider sx={{pt: 2}} /> */}

        {props.children}

        {activeStep === steps.length ? (
            <React.Fragment>

            </React.Fragment>
        ) : (
            <React.Fragment>
                <Box sx={{ py: 3 }}>
                    <Button
                    color="inherit"
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{mr: 5}}
                    >
                    Zurück
                    </Button>

                    <Button variant="contained" onClick={handleNext}>
                    {step_button_labels[activeStep]}
                    </Button>
                </Box>
            </React.Fragment>
        )}
        </Box>
    );
}