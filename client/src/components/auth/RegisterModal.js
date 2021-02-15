import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert,
} from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

export class RegisterModal extends Component {
  state = {
    modal: false,
    name: "",
    email: "",
    password: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  // for showing the error messages
  componentDidUpdate(prevProps) {
    // when we map the error state to our props, we want to see if it changed at all
    const { error, isAuthenticated } = this.props; // since we have access to error when we brought it up from root reducer
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        // we created the id for error in the authActions
        this.setState({ msg: error.msg.msg }); // two msg bz we can see from the redux tool (we can also change it to one msg from backend)
      } else {
        this.setState({ msg: null });
      }
    }

    // if we hit register, the modal should close on its own
    if (this.state.modal) {
      // if the modal is open
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // if there is any error occured while registering, we have to clear the error after the modal cloases
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }); // e.target.name works for multiple onChange calls inside JSX provided the name is "name"
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = this.state;

    // Create user object
    const newUser = {
      name,
      email,
      password,
    };

    // Attempt to register
    this.props.register(newUser);
  };

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Register
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Register</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Register
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // we are bringing isAuthenticated bz we wanna close the modal once we are authenticated
  isAuthenticated: state.auth.isAuthenticated,
  // error state so that we can output the error message. These error and auth are coming from the root reducer which gives us access to all the stuff withing the state of the error and the auth reducer
  error: state.error,
});

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
); // here if we don't use the fn it will still work.
