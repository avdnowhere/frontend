import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { amber, green, red } from '@material-ui/core/colors';
import { IconButton, SnackbarContent } from '@material-ui/core';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        borderLeft: "6px solid",
        borderColor: green[700],
        "& $iconVariant": {
            color: green[700],
        }
    },
    error: {
        borderLeft: "6px solid",
        borderColor: red[700],
        "& $iconVariant": {
            color: red[700],
        }
    },
    info: {
        borderLeft: "6px solid",
        borderColor: "#0078D7",
        "& $iconVariant": {
            color: "#0078D7",
        }
    },
    warning: {
        borderLeft: "6px solid",
        borderColor: amber[700],
        "& $iconVariant": {
            color: amber[700],
        }
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: 20,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    snackbarContent: {
        color: "black",
        backgroundColor: "white"
    }
});

function MySnackbarContent(props) {
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    const classes = makeStyles(styles1)();
    const snackbarClasses = makeStyles(theme => ({
        message: {
            flex: 1
        },
        action: {
            right: 8
        }
    }))();

    return (
        <SnackbarContent
            classes={snackbarClasses}
            className={classNames(classes.snackbarContent, classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                onClose && <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContent.propTypes = {
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default (MySnackbarContent);