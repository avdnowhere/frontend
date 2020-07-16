import React, { useState, useEffect, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { connect } from 'react-redux';
import { showSnackbar } from '../../action/SnackBarAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    datePicker: {
        marginLeft: 30,
        marginTop: 5,
    },
    timePicker: {
        verticalAlign: 'bottom',
        marginLeft: 30,
        marginTop: 20
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
    dialogContent: {
        minHeight: 100
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function RescheduleBookingDialog({ dispatch, ...props }) {
    const apiUrl = 'http://localhost/carsomeapi/api/';
    const apiHeaders = { 'ApiKey': 'SuFH7x5V2v', 'Content-Type': 'application/json' };

    const classes = useStyles();
    const { isOpen, isClose, disableTextField, isSubmitting } = props;
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSetDate, setIsSetDate] = useState(false);
    const minDate = new Date();
    const [maxDate, setMaxDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(0);
    const [timeSelection, setTimeSelection] = useState([]);
    const [oriTimeSelection, setOriTimeSelection] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [body, setBody] = useState({
        Date: '',
        BookTimeId: 0,
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

    const handleChangeSelectedDate = date => {
        setIsSetDate(true);
        setSelectedDate(date);
        setSelectedTime(0);
        setDisableSubmit(true);

        let bookingDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        setBody({
            ...body,
            Date: bookingDate
        });

        checkCurrentTime(bookingDate);
    }

    const handleChangeSelectedTime = time => {
        setSelectedTime(time.target.value);
        setDisableSubmit(true);

        setBody({
            ...body,
            BookTimeId: time.target.value
        });

        if(selectedDate && time.target.value !== 0){
            handleSubmitSearch(time.target.value);
        }
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

    const handleSubmitSearch = (time) => {
        setIsSearching(true);

        let bookingDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();

        axios.get(apiUrl + 'checkbookingdetails/' + bookingDate + '/' + time, { headers: apiHeaders })
        .then(response => {
            setTimeout(function(){
                setIsSearching(false);
                if(response.data.BookingDetailsData.Id > 0){
                    setDisableSubmit(false);
                    return dispatch(showSnackbar("The selected slot is avaiable. Please click Reschedule to confirm.", "success"));
                } else {
                    return dispatch(showSnackbar("The selected slot is fully booked. Please select another date or time.", "warning"));
                }

            }, 2000);
        })
        .catch(error => {
          console.log(error);
        });
    }

    return (
        <div>
            <Dialog open={isOpen} onClose={isClose} aria-labelledby="form-dialog-title" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Reschedule Booking</DialogTitle>
                <form>
                    <DialogContent className={classes.dialogContent}>
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
                                <Grid item xs={5} className={classes.timePicker}>
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
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={isClose}
                        >
                            Cancel
                        </Button>
                        <div className={classes.wrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={disableSubmit || isSearching || isSubmitting}
                                onClick={(e)=>props.rescheduleBooking(e, body)}
                            >
                                Reschedule
                            </Button>
                            {(isSearching || isSubmitting) && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default connect() (RescheduleBookingDialog);