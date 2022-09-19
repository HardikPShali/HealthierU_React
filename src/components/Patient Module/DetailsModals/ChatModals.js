import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

export const AlertChatDialog = ({ alertChatClose, alertChat }) => {
    return (
        <Dialog
            onClose={alertChatClose}
            aria-labelledby="customized-dialog-title"
            open={alertChat}
        >
            <DialogTitle id="customized-dialog-title" onClose={alertChatClose}>
                Chat can only be initiated 2 days before appointment and upto 3
                days after the appointment.
            </DialogTitle>
            <DialogActions>
                <button
                    onClick={alertChatClose}
                    className="btn btn-primary"
                    id="close-btn"
                >
                    OK
                </button>
            </DialogActions>
        </Dialog>
    )
}

export const ConfirmChatDialog = ({ confirmChatClose, confirmChat, chatClickHandler }) => {
    return (
        <Dialog
            onClose={confirmChatClose}
            aria-labelledby="customized-dialog-title"
            open={confirmChat}
        >
            {
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={confirmChatClose}
                >
                    Do you want to Start Chat
                </DialogTitle>
            }
            <DialogActions>
                <div onClick={() => chatClickHandler()}>
                    <button className="btn btn-primary" id="close-btn">
                        Yes
                    </button>
                </div>
                <button
                    onClick={confirmChatClose}
                    className="btn btn-primary"
                    id="close-btn"
                >
                    No
                </button>
            </DialogActions>
        </Dialog>
    )
}