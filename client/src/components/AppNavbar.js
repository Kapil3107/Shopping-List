import React, { Component, Fragment } from 'react';
import {   // given in reactstrap components in navbar
    Collapse,
    Navbar, //actual navbar
    NavbarToggler,
    NavbarBrand,
    Nav, // which will wrap around all the links
    NavItem, // will wrap the nav link
    NavLink, // have the href attribute on it
    Container // just a bootstrap container to move everything in the middle
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

class AppNavbar extends Component {
    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => { // if no arrow function , we have to bind this fn in constructor
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        // two variables - one for authlinks (for users that are logged in) and one for guest links
        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">
                        <strong>{user ? `Welcome ${user.name}` : ''}</strong>
                    </span>
                </NavItem>
                <NavItem>
                    <Logout />
                </NavItem>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal />
                </NavItem>
                <NavItem>
                    <LoginModal />
                </NavItem>
            </Fragment>
        )

        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">  {/* dark attribut is to say that since navbar is dark so the text should be light */}
                    <Container>
                        <NavbarBrand href="/">ShoppingList</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar> {/* we are letting it know that it is a part of navbar using navbar attribute */}
                            <Nav className="ml-auto" navbar> {/* ml-auto (margin-left auto) aligns the links to the right */}
                                {isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);