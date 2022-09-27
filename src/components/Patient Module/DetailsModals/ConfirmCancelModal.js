import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

const ConfirmCancelModal = ({
    selectedAppointment,
    handleClose,
    open,
    hourDifference,
    handleDelete
}) => {
    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Are you sure you want to cancel?
                </DialogTitle>
                {/* <DialogContent dividers>
                    <Typography gutterBottom>
                        {hourDifference < 24 && (
                            <span>
                                You are cancelling less then 24h prior the appointment start
                                time, unfortunately you will not be reimbursed
                            </span>
                        )}
                        {hourDifference > 24 && (
                            <span>
                                Your refund will come next week and 5% service fees will be
                                deducted
                            </span>
                        )}
                    </Typography>
                </DialogContent> */}
                <DialogActions>
                    <button
                        onClick={() => handleDelete(selectedAppointment)}
                        className="btn btn-primary"
                    >
                        OK
                    </button>
                    <button onClick={handleClose} className="btn btn-secondary">
                        Cancel
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ConfirmCancelModal