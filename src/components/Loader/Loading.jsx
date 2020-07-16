import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
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

const Loading = ({isLoading}) => {
    const classes = useStyles();
    const skeletonList = [{key: 1}, {key: 2}, {key: 3}, {key: 4}];

    return(
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
    )
}

export default Loading;