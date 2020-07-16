import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
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

function SearchBookingNoDialog({ ...props }) {
    const classes = useStyles();
    const { isOpen, isClose, isSubmitting } = props;
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
                <form>
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
                        <div className={classes.wrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={disableSubmit || isSubmitting}
                                onClick={(e)=>props.searchBookingNo(e, bookingNo)}
                            >
                                Search
                            </Button>
                            {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default SearchBookingNoDialog;