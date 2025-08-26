'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { JobContext } from '../../context/JobContext';
import { AuthContext } from '../../context/AuthContext';
import ImageModal from '../../components/ImageModal';

export default function GovernmentJobsClient() {
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);

  if (!jobContext || !authContext) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const { jobs, addJob, deleteJob } = jobContext;
  const { isAdmin } = authContext;
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [jobDetail, setJobDetail] = useState('');
  const [jobImage, setJobImage] = useState<File | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (jobImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addJob({
          title: jobTitle,
          company: 'Your Company', // Placeholder
          location: `${city}, ${country} Government`,
          description: jobDetail,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(jobImage);
    } else {
      addJob({
        title: jobTitle,
        company: 'Your Company', // Placeholder
        location: `${city}, ${country} Government`,
        description: jobDetail,
        image: null,
      });
    }
    setJobTitle('');
    setCity('');
    setJobDetail('');
    setJobImage(null);
  };

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/common-bg.png)", backgroundSize: 'cover' }}>
      {/* <script src="https://fpyf8.com/88/tag.min.js" data-zone="166270" async data-cfasync="false"></script> */}
      <h1 className="text-center mb-4">Government Jobs</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Government Jobs</h2>
          {jobs.filter(job => job.location.toLowerCase().includes('government')).map((job) => (
            <Card key={job.id} className="mb-3">
              {job.image && 
                <Card.Img 
                  variant="top" 
                  src={job.image} 
                  style={{ maxWidth: '200px', cursor: 'pointer' }} 
                  onClick={() => handleImageClick(job.image as string)} 
                />
              }
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                <Card.Text>{job.location}</Card.Text>
                <Button variant="primary" href={`/jobs/${job.id}`} className="me-2">View Details</Button>
                {isAdmin && (
                  <Button variant="danger" onClick={() => deleteJob(job.id)}>Delete</Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
        {isAdmin && (
          <Col md={4}>
            <h2>Post a Government Job</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formJobTitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCountry">
                <Form.Label>Government Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Federal, State, Local"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formJobDetail">
                <Form.Label>Job Detail</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter job detail"
                  value={jobDetail}
                  onChange={(e) => setJobDetail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Job Advertisement Picture</Form.Label>
                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobImage(e.target.files ? e.target.files[0] : null)} />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        )}
      </Row>
      <ImageModal show={showModal} onHide={() => setShowModal(false)} imageUrl={modalImageUrl} />
    </Container>
  );
}
