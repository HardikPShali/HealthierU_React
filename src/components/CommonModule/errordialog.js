import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
 
const ErrorDialog = (props) => {
    //console.log("Props ::: ", props)
    return (
        <Dialog
            open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Oops !"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Something went wrong.
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Link to={props.homeUrl}><Button color="primary" autoFocus>
                    Go To Homepage
                </Button></Link>
            </DialogActions>
        </Dialog>
    )
}

export default ErrorDialog;