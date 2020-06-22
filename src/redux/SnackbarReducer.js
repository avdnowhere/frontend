const defaultState = {
    open: false,
    variant: "error",
    message: "An error occurred!"
  }
  
  const snackbar = (state = defaultState, action) => {
    switch (action.type) {
      case 'SHOW_SNACKBAR':
        return {
          open: true,
            variant: action.variant,
            message: action.message
        }
  
        case 'CLOSE_SNACKBAR':
          return {
            ...state,
            open: false,
          }
  
          default:
            return state
    }
  }
  
  export default snackbar;