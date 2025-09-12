
'use client';

import { Container, Form, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { login } = authContext;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login(email, password)) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/loginbg.webp)", backgroundSize: 'cover', backgroundPosition: 'center', padding: '50px', borderRadius: '15px' }}>
      <h1>Admin Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <p className="text-danger">{error}</p>}
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}
