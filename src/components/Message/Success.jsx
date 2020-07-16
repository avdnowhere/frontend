import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Animation from '../Loader/Animation';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    notFoundBasicLayout: {
        width: '100%',
        textAlign: "center",
        boxShadow: 'none'
    },
    textCenter: {
        textAlign: 'center'
    },
}));

const Success = ({name, bookingNo}) => {
    const classes = useStyles();

    return(
        <Container component="main">
        <Paper className={classes.notFoundBasicLayout}>
            <div className={classes.textCenter}>
                <Fragment>
                    <div>
                        <Animation json={require("../../assets/welcome.json")} style={{ width: '40%', height: 'unset' }} />
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
    )
}

export default Success;