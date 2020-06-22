import React from 'react'
import { hideSnackbar } from '../../action/SnackBarAction'
import { Snackbar } from '@material-ui/core'
import SnackbarContent from "./SnackbarContent"
import { connect } from 'react-redux'
import { withTheme } from '@material-ui/styles'

const SnackbarWrapper = ({ dispatch, snackbar, theme }) => {

    const onClose = e => {
        dispatch(hideSnackbar())
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <SnackbarContent
                style={{
                    background: "#f5f9fe",
                    color: "#000"
                }}
                onClose={onClose}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        </Snackbar>)
}

const mapStateToProps = state => {
    return {
        snackbar: state.snackbar
    }
}


const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SnackbarWrapper))
