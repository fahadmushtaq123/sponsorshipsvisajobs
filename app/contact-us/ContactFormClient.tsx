
'use client';

import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function ContactFormClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h1 className="text-center mb-4">Contact Us</h1>
          <h2 className="mb-4">Send us a Message</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>

            {submissionStatus === 'success' && (
              <Alert variant="success" className="mt-3">
                Your message has been sent successfully!
              </Alert>
            )}
            {submissionStatus === 'error' && (
              <Alert variant="danger" className="mt-3">
                There was an error sending your message. Please try again later.
              </Alert>
            )}
          </Form>
        </Col>
        <Col md={6}>
          <h3>Other Ways to Reach Us</h3>
          <p><strong>Email:</strong> <a href="mailto:info@sponsorshipvisajobs.com">info@sponsorshipvisajobs.com</a></p>
          <p><strong>Phone:</strong> +92 302 4118228</p>
        </Col>
      </Row>
    </Container>
  );
}
