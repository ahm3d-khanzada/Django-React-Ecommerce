import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../actions/UserActions';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom'; 

const ResetPasswordScreen = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    
    const resetPasswordState = useSelector(state => state.resetPassword);
    const { loading, success, error } = resetPasswordState;

    useEffect(() => {
        if (password !== password2) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
        }

        // Redirect to login page after successful password reset
        if (success) {
            setTimeout(() => {
                navigate('/login');  
            }, 2000);
        }
    }, [password, password2, success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password === password2) {
            dispatch(resetPassword(uid, token, password));
        }
    };

    const renderErrorMessage = () => {
        // Check if error is an object and extract the message properly
        if (error) {
            if (typeof error === 'object') {
                return Object.values(error).map((err, index) => (
                    <Alert key={index} variant="danger">{err}</Alert>
                ));
            } else {
                return <Alert variant="danger">{error}</Alert>;
            }
        }
        return null;
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {loading && (
                <div>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )}
            {success && <Alert variant="success">Password reset successfully. Redirecting to login...</Alert>}
            {renderErrorMessage()}
            {message && <Alert variant="danger">{message}</Alert>}
            
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
        </div>
    );
};

export default ResetPasswordScreen;
