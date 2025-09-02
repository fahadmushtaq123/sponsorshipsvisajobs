'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { Job } from '../../context/JobContext';
import { JobContext } from '../../context/JobContext';
import { AuthContext } from '../../context/AuthContext';

interface GovernmentJobsClientProps {
  initialJobs: Job[];
}

export default function GovernmentJobsClient({ initialJobs }: GovernmentJobsClientProps) {
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);

  if (!jobContext || !authContext) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const { addJob, deleteJob } = jobContext;
  const jobs = initialJobs;
  const { isAdmin } = authContext;
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [jobDetail, setJobDetail] = useState('');
  const [jobImage, setJobImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl: string | null = null;

    if (jobImage) {
      const formData = new FormData();
      formData.append('file', jobImage);

      try {
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadData.imageUrl;
        } else {
          console.error('Image upload failed:', uploadData.message);
          alert('Failed to upload image. Please try again.');
          return; // Stop submission if image upload fails
        }
      } catch (error) {
        console.error('Error during image upload:', error);
        alert('Error uploading image. Please try again.');
        return; // Stop submission if image upload fails
      }
    }

    addJob({
      title: jobTitle,
      company: companyName,
      location: `${city}, ${country} Government`,
      description: jobDetail,
      image: imageUrl, // Save the Cloudinary URL
    });
    setJobTitle('');
    setCompanyName(''); // Reset companyName
    setCity('');
    setJobDetail('');
    setJobImage(null);
  };

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/common-bg.png)", backgroundSize: 'cover' }}>
      <h1 className="text-center mb-4">Government Jobs</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Government Jobs</h2>
          {jobs.filter(job => job.location.toLowerCase().includes('government')).map((job) => (
            <Card key={job.id} className="mb-3">
              {job.image && 
                <Image
                  src={job.image}
                  alt={job.title || 'Job Image'}
                  width={200}
                  height={150}
                  style={{ cursor: 'pointer' }}
                  objectFit="contain"
                />
              }
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                <Card.Text>{job.location}</Card.Text>
                <Link href={`/jobs/${job.id}`} passHref>
                  <Button variant="primary" className="me-2">More Detail</Button>
                </Link>
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

              <Form.Group className="mb-3" controlId="formCompanyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
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
    </Container>
  );

  }
