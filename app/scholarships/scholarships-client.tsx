'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { ScholarshipContext } from '../../context/ScholarshipContext';
import { AuthContext } from '../../context/AuthContext';

export default function ScholarshipsClient() {
  const scholarshipContext = useContext(ScholarshipContext);
  const authContext = useContext(AuthContext);

  if (!scholarshipContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { scholarships, addScholarship, deleteScholarship } = scholarshipContext;
  const { isAdmin } = authContext;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addScholarship({
          title,
          description,
          image: reader.result as string,
        });
        setTitle('');
        setDescription('');
        setImage(null);
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Scholarships Foreign Universities</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Available Scholarships for Foreign Universities</h2>
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="mb-3">
              <Card.Img variant="top" src={scholarship.image} />
              <Card.Body>
                <Card.Title>{scholarship.title}</Card.Title>
                <Card.Text>{scholarship.description}</Card.Text>
                {isAdmin && (
                  <Button variant="danger" onClick={() => deleteScholarship(scholarship.id)}>Delete</Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
        {isAdmin && (
          <Col md={4}>
            <h2>Post a Scholarship for Foreign Universities</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files ? e.target.files[0] : null)} required />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        )}
      </Row>
    </Container>
  );
}
