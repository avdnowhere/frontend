export const showSnackbar = (message, variant) => ({
    type: 'SHOW_SNACKBAR',
    message,
    variant,
    open: true
})

export const hideSnackbar = () => ({
    type: 'CLOSE_SNACKBAR',
    open: false
})