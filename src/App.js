import React, { useState, Fragment, useEffect } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { showSnackbar } from './action/SnackBarAction';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { connect } from 'react-redux';
import SnackbarConnect from './components/Snackbar/SnackbarConnect';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import SearchBookingNoDialog from './components/Modal/SearchBookingNoDialog';
import CancelBookingDialog from './components/Modal/CancelBookingDialog';
import RescheduleBookingDialog from './components/Modal/RescheduleBookingDialog';
import Loading from './components/Loader/Loading';
import Success from './components/Message/Success';
import Booking from './components/Form/Booking';

const useStyles = makeStyles(({ spacing }) => ({
    card: {
        marginTop: 50,
        borderRadius: spacing(0.5),
        transition: '0.3s',
        width: '100%',
        overflow: 'initial',
        background: '#ffffff',
        boxShadow: 'none'
    },
    content: {
        textAlign: 'left',
    },
    overrideHeader: {
        margin: "-40px 20px 0px",
        display: 'inline-block',
        background: 'linear-gradient(to right, rgb(59, 138, 87), #3eb554)',
        width: '92%'
    },
    textCenter: {
        textAlign: 'center'
    },
    iconColor: {
        color: '#000'
    },
    iconSize: {
        fontSize: 30
    },
    datePicker: {
        marginTop: 5,
        marginLeft: 60,
    },
    timePicker: {
      verticalAlign: 'bottom',
      marginLeft: 70,
      marginTop: 20
    },
    searchBookingNo: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'none',
        float: 'right'
    },
}));

const App = ({dispatch}) => {
    const apiUrl = 'http://localhost/carsomeapi/api/';
    const apiHeaders = { 'ApiKey': 'SuFH7x5V2v', 'Content-Type': 'application/json' };

    const classes = useStyles();
    const cardHeaderStyles = useContainedCardHeaderStyles();
    const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
    const cardHeaderShadowStyles = useFadedShadowStyles();

    const [selectedDate, setSelectedDate] = useState(null);
    const [isSetDate, setIsSetDate] = useState(false);
    const minDate = new Date();
    const [maxDate, setMaxDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);
    const [isSetTime, setIsSetTime] = useState(false);
    const [timeSelection, setTimeSelection] = useState([]);
    const [oriTimeSelection, setOriTimeSelection] = useState([]);
    const [disableTextField, setDisableTextField] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSlotAvailable, setIsSlotAvailable] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [name, setName] = useState(null);
    const [bookingNo, setBookingNo] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [body, setBody] = useState({
        Date: '',
        BookTimeId: 0,
    });

    const [bodyBooking, setBodyBooking] = useState({
        Name: '',
        Email: '',
        MobileNo: '',
        CarRegistrationNo: '',
        BookingStatus: ''
    });

    useEffect(() => {
      let nextThreeWeeksDate = new Date();
      nextThreeWeeksDate.setDate(nextThreeWeeksDate.getDate() + 21);
      setMaxDate(nextThreeWeeksDate);

      axios.get(apiUrl + 'allbookingtime', { headers: { 'ApiKey': 'SuFH7x5V2v', 'Content-Type': 'application/json' } })
      .then(response => {
            if(response.data.BookingTimeData.length > 0){
                setTimeSelection(response.data.BookingTimeData);
                setOriTimeSelection(response.data.BookingTimeData);
            } else {
                return dispatch(showSnackbar("There are no available booking time at the moment.", "warning"));
            }
      })
      .catch(error => {
        console.log(error);
      });

    }, [dispatch]);

    const disableWeekends = date => {
        return date.getDay() === 0;
    }

    const resetAllForms = () => {
        setSelectedDate(null);
        setSelectedTime(0);
        setIsSetDate(false);
        setIsSetTime(false);
        setDisableTextField(false);
        setIsSlotAvailable(false);
        setIsBookingSuccess(false);
        setIsReset(true);
    }

    const submitRegistration = (event, bodyParam) => {
        event.preventDefault();
        const newBody = {...body, ...bodyParam};
        handleSubmitRegistration(newBody);
    }

    const handleSubmitRegistration = (newBody) => {
        setIsSlotAvailable(false);
        setIsLoading(true);
        
        axios.post(apiUrl + 'addnewbookingdetails', newBody, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsLoading(false);
                if(response.data.BookingDetailsData.Id > 0){
                    resetAllForms();
                    setName(response.data.BookingDetailsData.Name);
                    setBookingNo(response.data.BookingDetailsData.BookingNo);
                    setIsBookingSuccess(true);
                } else {
                    if(response.data.BookingDetailsData.ApiStatus === 'Not Available'){
                        return dispatch(showSnackbar("The selected slot is fully booked. Please select another date or time.", "warning"));
                    } else if(response.data.BookingDetailsData.ApiStatus === 'Already Exist') {
                        setIsSlotAvailable(true);
                        setBodyBooking({
                            ...bodyBooking,
                            Name: newBody.Name,
                            Email: newBody.Email,
                            MobileNo: newBody.MobileNo,
                            CarRegistrationNo: newBody.CarRegistrationNo,
                        });

                        return dispatch(showSnackbar("The car with registration no " + newBody.CarRegistrationNo + " has already booked.", "warning"));                   
                    } else {
                        resetAllForms();
                        return dispatch(showSnackbar("An unexpected error has occurred. Please try again later.", "error"));
                    }
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    const handleChangeSelectedDate = date => {
        if(isSlotAvailable){
            setIsSlotAvailable(false);
        }

        setIsSetDate(true);
        setSelectedDate(date);
        setSelectedTime(0);

        let bookingDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        setBody({
            ...body,
            Date: bookingDate
        });

        checkCurrentTime(bookingDate);
    }

    const handleChangeSelectedTime = time => {
        if(isSlotAvailable){
            setIsSlotAvailable(false);
        }

        if(isSetDate && time.target.value > 0){
            setIsSetTime(true);
        } else {
            setIsSetTime(false);
        }

        setSelectedTime(time.target.value);

        setBody({
            ...body,
            BookTimeId: time.target.value
        });
    }

    const checkCurrentTime = (date) => {
        const today = new Date();
        const currentDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        const currentTime = today.getHours();
        const newTimeSelection = [];

        if(currentDate === date){
            timeSelection.forEach(function(item){
                let label = item.label.split('.');
                let time = Number(label[0]);
                if(time > currentTime){
                    newTimeSelection.push(item);
                }
            });
            if(newTimeSelection.length > 0){
                setTimeSelection(newTimeSelection);
            }
        } else {
            setTimeSelection(oriTimeSelection);
        }
    }

    const handleSubmitSearch = event => {
        event.preventDefault();
        setIsSlotAvailable(false);
        setIsLoading(true);
        setIsBookingSuccess(false);
        setIsReset(true);

        let bookingDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();

        axios.get(apiUrl + 'checkbookingdetails/' + bookingDate + '/' + selectedTime, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsLoading(false);
                if(response.data.BookingDetailsData.Id > 0){
                    setIsSlotAvailable(true);
                    return dispatch(showSnackbar("The selected slot is avaiable. Please fill up your personal information.", "success"));
                } else {
                    return dispatch(showSnackbar("The selected slot is fully booked. Please select another date or time.", "warning"));
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    const handleCloseDialog = () => {
        setShowDialog(false);
    }

    const handleClickOpen = () => {
        setShowDialog(true);
    };

    const handleSearchBookingNo = (event, bookingNo) => {
        event.preventDefault();
        setIsSubmitting(true);

        axios.get(apiUrl + 'searchbookingdetails/' + bookingNo, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsLoading(false);
                setIsSubmitting(false);
                if(response.data.BookingDetailsData.Id > 0){
                    setDisableTextField(true);
                    setIsSlotAvailable(true);
                    setIsSetDate(false);
                    setIsSetTime(false);
                    setShowDialog(false);
                    setIsBookingSuccess(false);
                    setBookingNo(bookingNo);

                    setBodyBooking({
                        ...bodyBooking,
                        Name: response.data.BookingDetailsData.Name,
                        Email: response.data.BookingDetailsData.Email,
                        MobileNo: response.data.BookingDetailsData.MobileNo,
                        CarRegistrationNo: response.data.BookingDetailsData.CarRegistrationNo,
                        BookingStatus: response.data.BookingDetailsData.BookingStatus
                    });

                    setBody({
                        ...body,
                        Date: response.data.BookingDetailsData.Date,
                        BookTimeId: response.data.BookingDetailsData.BookTimeId
                    });

                    let bookingDate = new Date(response.data.BookingDetailsData.Date);
                    setSelectedDate(bookingDate);
                    setSelectedTime(response.data.BookingDetailsData.BookTimeId);

                    return dispatch(showSnackbar("The booking number was found in our system.", "success"));
                } else {
                    return dispatch(showSnackbar("The booking number does not exist.", "warning"));
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    const submitCancel = (event) => {
        event.preventDefault();
        setShowCancelDialog(true);
    }

    const handleCloseCancelDialog = () => {
        setShowCancelDialog(false);
    }

    const handleCancelBooking = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const newBody = {...body, BookingStatus: "Cancelled"};

        axios.put(apiUrl + 'updatebookingdetails/' + bookingNo, newBody, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setShowCancelDialog(false);
                setIsSubmitting(false);
                resetAllForms();
                if(response.data.BookingDetailsData.Id > 0){
                    return dispatch(showSnackbar("The booking no " + bookingNo + " has been cancelled successfully.", "success"));
                } else {
                    return dispatch(showSnackbar("An unexpected error has occurred. Please try again later.", "error"));
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    const submitReschedule = (event) => {
        event.preventDefault();
        setShowRescheduleDialog(true);
    }

    const handleCloseRescheduleDialog = () => {
        setShowRescheduleDialog(false);
    }

    const handleRescheduleBooking = (event, bodyParam) => {
        event.preventDefault();
        setIsSubmitting(true);
        const newBody = {...bodyParam, BookingStatus: "Rescheduled"};

        axios.put(apiUrl + 'updatebookingdetails/' + bookingNo, newBody, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setShowRescheduleDialog(false);
                setIsSubmitting(false);
                resetAllForms();
                if(response.data.BookingDetailsData.Id > 0){
                    return dispatch(showSnackbar("The booking no " + bookingNo + " has been rescheduled successfully.", "success"));
                } else {
                    return dispatch(showSnackbar("An unexpected error has occurred. Please try again later.", "error"));
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    return (
        <Container component="main" maxWidth="md" className={classes.center}>
            <SnackbarConnect />
            <SearchBookingNoDialog isOpen={showDialog} isClose={handleCloseDialog} isSubmitting={isSubmitting} searchBookingNo={handleSearchBookingNo} />
            <CancelBookingDialog isOpen={showCancelDialog} isClose={handleCloseCancelDialog} isSubmitting={isSubmitting} cancelBooking={handleCancelBooking} />
            <RescheduleBookingDialog isOpen={showRescheduleDialog} isClose={handleCloseRescheduleDialog} isSubmitting={isSubmitting} rescheduleBooking={handleRescheduleBooking} />
            <Grid container>
                <Grid item xs={12}>
                    <Card className={cx(classes.card, cardShadowStyles.root)}>
                        <CardHeader
                            className={cx(classes.overrideHeader, cardHeaderShadowStyles.root)}
                            classes={cardHeaderStyles}
                            title={'Inspection Slot'}
                            subheader={'Book your inspection slot on Carsome.my'}
                            action={disableTextField ? 
                                    <Button onClick={resetAllForms} className={classes.searchBookingNo}>
                                        Book Inspection Slot
                                    </Button> :
                                    <Button onClick={handleClickOpen} className={classes.searchBookingNo}>
                                        Search Booking Details
                                    </Button>}
                        />
                        <CardContent className={classes.content}>
                            <Grid container spacing={3}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid item xs={5} className={classes.datePicker}>
                                        <Fragment>
                                            <KeyboardDatePicker
                                                fullWidth
                                                label="Please select a date"
                                                format="dd/MM/yyyy"
                                                variant="inline"
                                                minDate={minDate} 
                                                maxDate={maxDate}
                                                disabled={disableTextField}
                                                value={selectedDate}
                                                onChange={handleChangeSelectedDate}
                                                shouldDisableDate={disableWeekends}
                                            />
                                        </Fragment>
                                    </Grid>
                                    <Grid item xs={3} className={classes.timePicker}>
                                        <Fragment>
                                            <Select
                                                fullWidth
                                                disabled={!isSetDate}
                                                value={selectedTime}
                                                onChange={handleChangeSelectedTime}
                                            >
                                                <MenuItem value={0}>Please select a time</MenuItem>
                                                {timeSelection.map(item => {
                                                return <MenuItem key={item.key} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Select>
                                        </Fragment>
                                    </Grid>
                                    <Grid item xs={2} className={classes.textCenter} style={{ marginTop: '10px' }}>
                                        {   !disableTextField 
                                            ?
                                                <IconButton onClick={handleSubmitSearch} className={classes.iconColor} disabled={!isSetTime}>
                                                    <SearchIcon className={classes.iconSize} />
                                                </IconButton>
                                            :
                                                null
                                        }
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} style={{ padding: '25px' }}>
                    {
                        !isSlotAvailable
                        ?
                            <Loading isLoading={isLoading} />
                        :
                            <Booking 
                                isReset={isReset}
                                bodyBooking={bodyBooking}
                                disableTextField={disableTextField}
                                submitRegistration={submitRegistration}
                                submitCancel={submitCancel}
                                submitReschedule={submitReschedule}
                            />
                    }
                    {
                        isBookingSuccess
                        ?
                            <Success name={name} bookingNo={bookingNo} />
                        :
                            null
                    }
                </Grid>
            </Grid>
        </Container>
    );
}

export default connect() (App)
