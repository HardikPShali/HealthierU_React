import React from "react";
import { Link, NavLink } from "react-router-dom";
//import NavDropdown from 'react-bootstrap/NavDropdown';
import '../admin.css';
import profileicon from '../../../images/Icons/profile.svg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import Cookies from 'universal-cookie';
import SearchIcon from '@material-ui/icons/Search';
// import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../../../images/logo/logo_white.svg';
import Hidden from '@material-ui/core/Hidden';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "#4F80E2",
    minHeight: "unset !important"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  title: {
    color: "#fff !important",
    textDecoration: "none !important"
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    backgroundColor: "#4F80E2",
    color: "#fff"
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Navbar = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const style = { display: "block" }

  const drawer = (<>
    <div className={classes.drawerHeader}>
      <img
        src={logo}
        id="icon"
        alt="HealthierU Logo"
        style={{ width: "70%", paddingLeft: "10px" }}
      />
    </div>
    <Divider />
    <List>
      <Link to="/admin" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "home" ? "active" : props.pageTitle === "doctorList" ? "active" : props.pageTitle === "patientList" ? "active" : ""}>
          <ListItemText primary={"User Management"} />
          {props.pageTitle === "home" ? <ExpandLess /> : props.pageTitle === "doctorList" ? <ExpandLess /> : props.pageTitle === "patientList" ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Link>
      <Collapse in={props.pageTitle === "home" || props.pageTitle === "doctorList" || props.pageTitle === "patientList"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/admin/doctorlist" style={{ textDecoration: "none" }}>
            <ListItem button className={props.pageTitle === "doctorList" ? "active" : ""} style={{ paddingLeft: "32px" }}>
              <ListItemText primary={"Doctor List"} />
            </ListItem>
          </Link>
          <Link to="/admin/patientlist" style={{ textDecoration: "none" }}>
            <ListItem button className={props.pageTitle === "patientList" ? "active" : ""} style={{ paddingLeft: "32px" }}>
              <ListItemText primary={"Patient List"} />
            </ListItem>
          </Link>
        </List>
      </Collapse>
      <Divider variant="middle" />
      <Link to="/admin/shop/home" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "shop" ? "active" : ""}>
          <ListItemText primary={"Shop Management"} />
        </ListItem>
      </Link>
      <Divider variant="middle" />
      <Link to="/admin/article/home" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "article" ? "active" : ""}>
          <ListItemText primary={"Article Management"} />
        </ListItem>
      </Link>
      <Divider variant="middle" />
      <Link to="/admin/workout/home" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "workout" ? "active" : ""}>
          <ListItemText primary={"Workout Management"} />
        </ListItem>
      </Link>
      <Divider variant="middle" />
      <Link to="/admin/user-management/document" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "document" ? "active" : ""}>
          <ListItemText primary={"Admin Document"} />
        </ListItem>
      </Link>
      {/* <Divider variant="middle" />
      <Link to="/admin/questionnaire/home" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "questionnaire" ? "active" : ""}>
          <ListItemText primary={"Questionnaire Management"} />
        </ListItem>
      </Link> */}
      <Divider variant="middle" />
      <Link to="/admin/serviceprovider/home" style={{ textDecoration: "none" }}>
        <ListItem button className={props.pageTitle === "serviceprovider" || props.pageTitle === "category" ? "active" : ""}>
          <ListItemText primary={"Service Provider Management"} />
        </ListItem>
      </Link>
      <Collapse in={props.pageTitle === "serviceprovider" || props.pageTitle === "category"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/admin/serviceprovider/servicecategory" style={{ textDecoration: "none" }}>
            <ListItem button className={props.pageTitle === "category" ? "active" : ""} style={{ paddingLeft: "32px" }}>
              <ListItemText primary={"Service Category"} />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </List>
  </>)

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    // <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    //   <div className="container">
    //     <Link className="navbar-brand" to="/admin">
    //       Admin Dashboard
    //   </Link>
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-toggle="collapse"
    //       data-target="#navbarSupportedContent"
    //       aria-controls="navbarSupportedContent"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>

    //     <div
    //     className="collapse navbar-collapse"
    //     id="navbarSupportedContent"
    //     >

    //     <NavLink style={style} className="btn btn-outline-light mr-2" exact to="/admin/shop/home">Shop</NavLink>
    //     <NavLink style={style} className="btn btn-outline-light mr-2" exact to="/admin/article/home">Article</NavLink>
    //     <NavLink style={style} className="btn btn-outline-light mr-2" exact to="/admin/workout/home">Workout</NavLink>
    //     <NavLink style={style} className="btn btn-outline-light mr-2" exact to="/admin/user-management/document">Admin Document</NavLink>
    //     <NavLink style={style} className="btn btn-outline-light mr-2" exact to="/admin/questionnaire/home">Questionnaire</NavLink>
    //     <NavLink style={style} className="text-light mr-4 ml-2" exact to="/admin/search"><SearchIcon/></NavLink>
    //     {/* <NavLink className="btn btn-outline-light mr-2" exact to="/admin/patient/chat">Chat</NavLink> */}
    //     <NavLink to="#"><img src={profileicon} alt="" onClick={handleClick} className="profile-icon" width="35" /></NavLink>
    //     <Menu
    //       id="simple-menu"
    //       anchorEl={anchorEl}
    //       keepMounted
    //       open={Boolean(anchorEl)}
    //       onClose={handleClose}
    //       // anchorOrigin={{
    //         //   vertical: 'bottom',
    //         //   horizontal: 'center',
    //         // }}
    //         transformOrigin={{
    //           vertical: 'top',
    //           horizontal: 'center',
    //         }}
    //         >
    //       {/* <Link to="/admin/user-management/users/add" style={{ textDecoration: "none" }}><MenuItem>Add User</MenuItem></Link> */}
    //       <Link to="/admin/addservice-provider" style={{ textDecoration: "none" }}><MenuItem>Add Service Provider</MenuItem></Link>
    //       <Link to="/admin/changepassword" style={{ textDecoration: "none" }}><MenuItem>Change Password</MenuItem></Link>
    //       <Link to="/admin/logout" style={{ textDecoration: "none" }}><MenuItem>Logout</MenuItem></Link>
    //     </Menu>
    //     </div>
    //   </div>
    // </nav>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <NavLink to="/admin" className={classes.title}><Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography></NavLink>
          <div className="ml-auto" style={{ display: "flex", alignItems: "center" }}>
            <NavLink style={style} className="text-light mr-4 ml-2" exact to="/admin/search"><SearchIcon /></NavLink>
            <NavLink to="#"><img alt='profile-icon' src={profileicon} onClick={handleClick} className="profile-icon" width="35" /></NavLink>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {/* <Link to="/admin/user-management/users/add" style={{ textDecoration: "none" }}><MenuItem>Add User</MenuItem></Link> */}
              <Link to="/admin/addservice-provider" style={{ textDecoration: "none" }}><MenuItem>Add Service Provider</MenuItem></Link>
              <Link to="/admin/changepassword" style={{ textDecoration: "none" }}><MenuItem>Change Password</MenuItem></Link>
              <Link to="/admin/logout" style={{ textDecoration: "none" }}><MenuItem>Logout</MenuItem></Link>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );

};

export default Navbar;
