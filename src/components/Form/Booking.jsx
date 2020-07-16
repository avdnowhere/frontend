import React, { useState, useEffect, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Validate from '../../utils/Validate';

const useStyles = makeStyles(() => ({
    sectionSpacing: {
        marginTop: '20px'
    },
    submitDisable: {
        marginTop: 20,
        height: '50px',
        fontWeight: 'normal'
    },
    submitEnable: {
        marginTop: 20,
        height: '50px',
        fontWeight: 'bold'
    },
    cancelButton: {
        height: '50px',
        fontWeight: 'bold'
    },
    rescheduleButton: {
        height: '50px',
        fontWeight: 'bold',
        float: 'right'
    },
}));

const Booking = ({ ...props }) => {

    const classes = useStyles();
    const { isReset, bodyBooking, disableTextField } = props;
    const [disableSubmit, setDisableSubmit] = useState(true);

    const [body, setBody] = useState({
        Name: '',
        Email: '',
        MobileNo: '',
        CarRegistrationNo: '',
        BookingStatus: '',
    });

    const [error, setError] = useState({
        Name: false,
        Email: false,
        MobileNo: false,
        CarRegistrationNo: false
    });

    useEffect(() => {
            setBody(body => ({
                ...body,
                Name: bodyBooking.Name,
                Email: bodyBooking.Email,
                MobileNo: bodyBooking.MobileNo,
                CarRegistrationNo: bodyBooking.CarRegistrationNo,
                BookingStatus: bodyBooking.BookingStatus
            }));
    }, [bodyBooking]);

    useEffect(() => {
            setDisableSubmit(true);
            setBody(body => ({
                ...body,
                Name: '',
                Email: '',
                MobileNo: '',
                CarRegistrationNo: ''
            }));
    }, [isReset]);

    const checkEmptyData = () => {
        let emptyData = Object.keys(body).some((i) => {
            if(i === 'BookingStatus') {
                return false;
            }
            return body[i] === '';
        });
        setDisableSubmit(emptyData);
    }

    const handleChangeName = event => {
        if (event.target.value.length > 1) {
            setError({
                ...error,
                Name: false
            }); 
        } else {
            setError({
                ...error,
                Name: true
            });
        }
        checkEmptyData();

        setBody({
            ...body,
            Name: event.target.value.toUpperCase()
        });
    }

    const handleChangeEmail = event => {
        if (Validate.email(event.target.value)) {
            setError({
                ...error,
                Email: false
            });
        } else {
            setError({
                ...error,
                Email: true
            });
        }
        checkEmptyData();

        setBody({
            ...body,
            Email: event.target.value
        });
    }

    const handleChangeMobileNo = event => {
        if (Validate.phone(event.target.value)) {
            setError({
                ...error,
                MobileNo: false
            });
        } else {
            setError({
                ...error,
                MobileNo: true
            });
        }
        checkEmptyData();

        setBody({
            ...body,
            MobileNo: event.target.value.replace(/\s/g, '')
        });
    }

    const handleChangeCarRegistrationNo = event => {
        if (event.target.value.length > 1) {
            setError({
                ...error,
                CarRegistrationNo: false
            });
        } else {
            setError({
                ...error,
                CarRegistrationNo: true
            });
        }
        checkEmptyData();

        setBody({
            ...body,
            CarRegistrationNo: event.target.value.toUpperCase().replace(/\s/g, '')
        });
    }

    return(
        <form>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant={'h6'}>
                        {disableTextField ? 'Booking' : 'Personal'} Information
                    </Typography>
                    <Typography variant={'subtitle2'}>
                        Details about your {disableTextField ? 'booking' : 'personal'} information
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Full Name"
                        disabled={disableTextField}
                        error={error.Name}
                        value={body.Name}
                        onChange={handleChangeName}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Email Address"
                        disabled={disableTextField}
                        error={error.Email}
                        value={body.Email}
                        onChange={handleChangeEmail}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Mobile Number"
                        disabled={disableTextField}
                        error={error.MobileNo}
                        value={body.MobileNo}
                        onChange={handleChangeMobileNo}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Car Registation Number"
                        disabled={disableTextField}
                        error={error.CarRegistrationNo}
                        value={body.CarRegistrationNo}
                        onChange={handleChangeCarRegistrationNo}
                    />
                </Grid>
                {
                    disableTextField
                    ?
                        <Fragment>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label="Booking Status"
                                    disabled={disableTextField}
                                    value={body.BookingStatus}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    disabled={body.BookingStatus === 'Cancelled'}
                                    className={classes.cancelButton}
                                    onClick={(e)=>props.submitCancel(e)}
                                >
                                    Cancel Booking
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={body.BookingStatus === 'Cancelled'}
                                    className={classes.rescheduleButton}
                                    onClick={(e)=>props.submitReschedule(e)}
                                >
                                    Reschedule Booking
                                </Button>
                            </Grid>
                        </Fragment>
                    :
                        null
                }
            </Grid>
            <Grid container className={classes.sectionSpacing}>
                <Grid item xs={12}>
                {
                    !disableTextField 
                    ?
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={disableSubmit || error.Name || error.Email || error.MobileNo || error.CarRegistrationNo}
                            className={(disableSubmit || error.Name || error.Email || error.MobileNo || error.CarRegistrationNo) ? classes.submitDisable : classes.submitEnable}
                            onClick={(e)=>props.submitRegistration(e, body)}
                        >
                            Submit
                        </Button>
                    :
                        null
                }
                </Grid>
            </Grid>
        </form>
    )
}

export default Booking;