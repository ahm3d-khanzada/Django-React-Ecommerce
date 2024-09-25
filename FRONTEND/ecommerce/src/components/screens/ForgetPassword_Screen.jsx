import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../actions/UserActions';
import { Button, Form, Alert } from 'react-bootstrap';

const ForgetPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    // Using optional chaining to prevent errors when the state is undefined
    const { loading, success, error } = useSelector(state => state.userForgotPassword || {});

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {loading && <p>Loading...</p>}
            {success && <Alert variant="success">Password reset email sent successfully.</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default ForgetPasswordScreen;
