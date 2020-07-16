import React from 'react';
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

function CancelBookingDialog({ ...props }) {
    const classes = useStyles();
    const { isOpen, isClose, isSubmitting } = props;

    return (
        <div>
            <Dialog open={isOpen} onClose={isClose} aria-labelledby="form-dialog-title" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Cancel Booking</DialogTitle>
                <form>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to cancel this booking?
                        </DialogContentText>
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
                                disabled={isSubmitting}
                                onClick={(e)=>props.cancelBooking(e)}
                            >
                                Yes
                            </Button>
                            {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default CancelBookingDialog;