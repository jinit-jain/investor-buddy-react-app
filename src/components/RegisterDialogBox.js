import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import MuiPhoneInput from 'material-ui-phone-number';
import TocIcon from '@material-ui/icons/Toc';
import axios from "axios";
import Slide from '@material-ui/core/Slide';
import {useSelector, useDispatch} from 'react-redux'
import actions from '../actions'
import {useHistory} from 'react-router-dom'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    },
  },
}));
export default function RegistrationFormDialog() {

    const classes = useStyles();
    const history = useHistory();

    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const dispatch = useDispatch()

    const [open, setOpen] = React.useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false)
    const [openErrorMessage, setOpenErrorMessage] = React.useState(false)

    const [state, setState] = React.useState({
        form : {
            first_name: "",
            last_name: "",
            email: "",
            contact: "",
            password: ""
        }
    });

    const resetState = () => {
        setState({
            form: Object.assign({}, state.form, {
                first_name: "",
                last_name: "",
                email: "",
                contact: "",
                password: ""
            }),
        })
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpenSuccessMessage = () => {
        setOpenSuccessMessage (true)
    }

    const handleClickOpenErrorMessage = () => {
        setOpenErrorMessage (true)
    }

    const handleClose = () => {
        setOpen(false);
        resetState();
    };

    const handleCloseSuccessMessage = () => {
        setOpenSuccessMessage(false)
        resetState()
        dispatch(actions.signIn())
        console.log(isLoggedIn)
        history.push('/multiselectlist')
    }

    const handleCloseErrorMessage = () => {
        setOpenErrorMessage(false)
        resetState()
        handleClickOpen()
    }

    const handleSubmit = async () => {
        console.log(state.form.first_name);
        console.log(state.form.last_name);
        console.log(state.form.email);
        console.log(state.form.contact);
        console.log(state.form.password);
        // axios request

        const response = await  axios.post('https://webappsvc-investor-buddy.azurewebsites.net/users/register', {
            email: state.form.email,
            password: state.form.password,
            first_name: state.form.first_name,
            last_name: state.form.last_name,
            contact: state.form.contact,
        })
        console.log(response)

        if (response.status === 200) {
            localStorage.setItem('user', state.form.email);
            await handleClickOpenSuccessMessage()
        } else {
            handleClickOpenErrorMessage()
        }

        handleClose();
    };

    const handleChange = (event) => {
        setState({
                form: Object.assign({}, state.form, {
                [event.target.name]: event.target.value,
            }),
        });
    }

    const handlePhoneChange = (value) => {
        setState({
            form: Object.assign({}, state.form, {
                contact: value,
            }),
        })
    }

    return (
            <div>
                <Button variant="filled" color="inherit" onClick={handleClickOpen}>
                    Register
                </Button>
                <Dialog 
                    open={open} 
                    onClose={handleClose} 
                    aria-labelledby="form-dialog-title" 
                    className={classes.root}>
                    <DialogTitle id="form-dialog-title">
                        <IconButton>
                            <TocIcon />                            
                        </IconButton>
                        Registration Form 
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to investor buddy service, you need to register with all the details required below:
                        </DialogContentText>
                        <TextField 
                            required 
                            autoFocus 
                            margin="dense" 
                            name="first_name" 
                            label="First Name" 
                            type="text" 
                            variant="outlined" 
                            size="small" 
                            width="100" 
                            onChange={handleChange} />
                        <TextField 
                            required 
                            margin="dense" 
                            name="last_name" 
                            label="Last Name" 
                            type="text" 
                            variant="outlined" 
                            size="small" 
                            width="100" 
                            onChange={handleChange} />
                        <MuiPhoneInput 
                            required 
                            defaultCountry="in" 
                            regions={'asia'} 
                            margin="dense" 
                            name="contact" 
                            label="Phone Number" 
                            variant="outlined" 
                            onChange={handlePhoneChange} />
                        <TextField 
                            required 
                            margin="dense" 
                            name="email" 
                            label="Email Address" 
                            type="email" 
                            variant="outlined" 
                            fullWidth 
                            onChange={handleChange} />
                        <TextField 
                            required 
                            margin="dense" 
                            name="password" 
                            label="Password" 
                            type="password" 
                            variant="outlined" 
                            fullWidth 
                            onChange={handleChange} />  
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleClose} 
                            color="secondary" 
                            startIcon={<CancelIcon />}
                            variant="contained">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            color="primary" 
                            endIcon={<SendIcon />}
                            variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openSuccessMessage}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseSuccessMessage}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="successMessage">{"Register Success"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Your Registration to this Portal was Successful
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSuccessMessage} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openErrorMessage}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseErrorMessage}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="successMessage">{"Register Failure"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Username Already Exists
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorMessage} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
}