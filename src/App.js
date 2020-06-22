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
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { showSnackbar } from './action/SnackBarAction';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { connect } from 'react-redux';
import SnackbarConnect from './components/Snackbar/SnackbarConnect';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Validate from './utils/Validate';
import Animation from './components/Loader/Animation';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

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
    notFoundBasicLayout: {
        width: '100%',
        textAlign: "center",
        boxShadow: 'none'
    },
    timePicker: {
      verticalAlign: 'bottom',
      marginLeft: 70,
      marginTop: 20
    },
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
    searchBookingNo: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'none',
        float: 'right'
    },
}));

function SearchBookingNoDialog({ ...props }) {
    const classes = useStyles();
    const { isOpen, isClose } = props;
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [bookingNo, setBookingNo] = useState('');

    const handleChangeBookingNo = event => {
        setBookingNo(event.target.value);
        if (event.target.value.length > 1) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onClose={isClose} aria-labelledby="form-dialog-title" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Search Booking Details</DialogTitle>
                <form className={classes.form}>
                    <DialogContent>
                        <DialogContentText>
                            Please enter your booking number.
                        </DialogContentText>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label="Booking Number"
                                    value={bookingNo}
                                    onChange={handleChangeBookingNo}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={isClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={disableSubmit}
                            onClick={(e)=>props.searchBookingNo(e, bookingNo)}
                        >
                            Search
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const App = ({dispatch}) => {
    const apiUrl = 'http://localhost/carsomeapi/api/';
    const apiHeaders = { 'ApiKey': 'SuFH7x5V2v', 'Content-Type': 'application/json' };
    const skeletonList = [{key: 1}, {key: 2}, {key: 3}, {key: 4}];

    const classes = useStyles();
    const cardHeaderStyles = useContainedCardHeaderStyles();
    const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
    const cardHeaderShadowStyles = useFadedShadowStyles();

    const [selectedDate, setSelectedDate] = useState(null);
    const [isSetDate, setIsSetDate] = useState(false);
    const [minDate, setMinDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);
    const [isSetTime, setIsSetTime] = useState(false);
    const [timeSelection, setTimeSelection] = useState([]);

    const [disableSubmit, setDisableSubmit] = useState(true);
    const [disableTextField, setDisableTextField] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSlotAvailable, setIsSlotAvailable] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);

    const [name, setName] = useState(null);
    const [bookingNo, setBookingNo] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const [body, setBody] = useState({
        Date: '',
        BookTimeId: 0,
        Name: '',
        Email: '',
        MobileNo: '',
        CarRegistrationNo: ''
    });

    const [error, setError] = useState({
        Name: false,
        Email: false,
        MobileNo: false,
        CarRegistrationNo: false
    });

    useEffect(() => {
      let nextThreeWeeksDate = new Date();
      nextThreeWeeksDate.setDate(nextThreeWeeksDate.getDate() + 21);
      setMinDate(nextThreeWeeksDate);

      axios.get(apiUrl + 'allbookingtime', { headers: { 'ApiKey': 'SuFH7x5V2v', 'Content-Type': 'application/json' } })
      .then(response => {
            if(response.data.BookingTimeData.length > 0){
                setTimeSelection(response.data.BookingTimeData);
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

    const checkEmptyData = () => {
        let emptyData = Object.keys(body).some((i) => {
            return body[i] === '';
        });
        setDisableSubmit(emptyData);
    }

    const resetAllForms = () => {
        setSelectedDate(null);
        setSelectedTime(0);
        setIsSetDate(false);
        setIsSetTime(false);
        setDisableSubmit(true);
        setDisableTextField(false);
        setIsSlotAvailable(false);
        setIsBookingSuccess(false);
        setBody({
            ...body,
            Name: '',
            Email: '',
            MobileNo: '',
            CarRegistrationNo: ''
        });
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

    const handleSubmitRegistration = event => {
        event.preventDefault();
        setIsSlotAvailable(false);
        setIsLoading(true);

        axios.post(apiUrl + 'addnewbookingdetails', body, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsLoading(false);
                if(response.data.BookingDetailsData.Id > 0){
                    resetAllForms();
                    setName(response.data.BookingDetailsData.Name);
                    setBookingNo(response.data.BookingDetailsData.BookingNo);
                    setIsBookingSuccess(true);
                } else {
                    if(response.data.BookingDetailsData.ApiStatus !== 'Failed'){
                        setIsSlotAvailable(true);
                        return dispatch(showSnackbar("The car with registration no " + body.CarRegistrationNo + " has already booked.", "warning"));
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

        let bookingDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        setBody({
            ...body,
            Date: bookingDate
        });
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

    const handleSubmitSearch = event => {
        event.preventDefault();
        setIsSlotAvailable(false);
        setIsLoading(true);
        setIsBookingSuccess(false);

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

    function handleSearchBookingNo(event, bookingNo) {
        event.preventDefault();
        
        axios.get(apiUrl + 'searchbookingdetails/' + bookingNo, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsLoading(false);
                if(response.data.BookingDetailsData.Id > 0){
                    setDisableTextField(true);
                    setIsSlotAvailable(true);
                    setIsSetDate(false);
                    setIsSetTime(false);
                    setShowDialog(false);
                    setIsBookingSuccess(false);

                    setBody({
                        ...body,
                        Name: response.data.BookingDetailsData.Name,
                        Email: response.data.BookingDetailsData.Email,
                        MobileNo: response.data.BookingDetailsData.MobileNo,
                        CarRegistrationNo: response.data.BookingDetailsData.CarRegistrationNo
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

    return (
        <Container component="main" maxWidth="md" className={classes.center}>
            <SnackbarConnect />
            <SearchBookingNoDialog isOpen={showDialog} isClose={handleCloseDialog} searchBookingNo={handleSearchBookingNo} />
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
                            <Paper className={classes.notFoundBasicLayout}>
                                <div className={classes.textCenter}>
                                    {   isLoading
                                        ?
                                            <Fragment>
                                                <Grid container spacing={2}>
                                                    {skeletonList.map(item => {
                                                    return  <Grid key={item.key} item xs={12} md={6}>
                                                                <Skeleton animation="wave" height={100} width="100%" />
                                                            </Grid>;
                                                    })}
                                                    <Grid item xs={12}>
                                                        <Skeleton animation="wave" height={100} width="100%" />
                                                    </Grid>
                                                </Grid>
                                            </Fragment>
                                        :   
                                            null
                                    }
                                </div>
                            </Paper>
                        :
                            <form className={classes.form}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant={'h6'} className={classes.bold}>
                                            {disableTextField ? 'Booking' : 'Personal'} Information
                                        </Typography>
                                        <Typography variant={'subtitle2'} className={classes.caption}>
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
                                            onClick={handleSubmitRegistration}
                                            >
                                                Submit
                                            </Button> 
                                        :
                                            null
                                    }
                                    </Grid>
                                </Grid>
                            </form>
                    }
                    {
                        isBookingSuccess
                        ?
                        <Container component="main">
                        <Paper className={classes.notFoundBasicLayout}>
                        <div className={classes.textCenter}>
                            <Fragment>
                                <div>
                                    <Animation json={require("./assets/welcome.json")} style={{ width: '40%', height: 'unset' }} />
                                </div>
                                <Typography variant="h6" gutterBottom>
                                    Dear {name},
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Your booking for inspection slot has been successfully registered on Carsome.my.
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: 5 }}>
                                    This is your booking number: <span style={{ fontWeight: 'bold' }}>{bookingNo}</span>.
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: 5 }}>
                                    Kindly be informed that one of our team will be in contact with you shortly.
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: 15 }}>
                                    Best regards,
                                </Typography>
                                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                    Carsome.my Team
                                </Typography>
                            </Fragment>
                            </div>
                            </Paper>
                            </Container>
                        :
                            null
                    }
                </Grid>
            </Grid>
        </Container>
    );
}

export default connect() (App)
