'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { JobContext } from '../../context/JobContext';
import { AuthContext } from '../../context/AuthContext';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function SponsorshipJobsClient() {
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  if (!jobContext || !authContext) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const { jobs, addJob, deleteJob } = jobContext;
  const { isAdmin } = authContext;
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [jobDetail, setJobDetail] = useState('');
  const [jobImage, setJobImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (jobImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addJob({
          title: jobTitle,
          company: companyName,
          location: `${city}, ${country}, Sponsorship`,
          description: jobDetail,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(jobImage);
    } else {
      addJob({
        title: jobTitle,
        company: companyName,
        location: `${city}, ${country}, Sponsorship`,
        description: jobDetail,
        image: null,
      });
    }
    setJobTitle('');
    setCompanyName(''); // Reset companyName
    setCountry('');
    setCity('');
    setJobDetail('');
    setJobImage(null);
  };

  const handleShare = async (job: any) => {
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company}`,
      url: `${window.location.origin}/jobs/${job.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/common-bg.png)", backgroundSize: 'cover' }}>
      <h1 className="text-center mb-4">Sponsorship Visa Jobs</h1>
      <Row>
        <Col md={isAdmin ? 8 : 12}>
          <h2>Jobs with Visa Sponsorship</h2>
          {jobs.filter(job => job.location && job.location.toLowerCase().includes('sponsorship')).map((job) => (
            <Card key={job.id} className="mb-3">
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                <Card.Text>{job.location}</Card.Text>
                <Card.Text><small className="text-muted">Posted on: {new Date(job.createdAt).toLocaleDateString()}</small></Card.Text>
                <Button variant="primary" href={`/jobs/${job.id}`} className="me-2">View Details</Button>
                <Button variant="outline-primary" onClick={() => handleShare(job)} className="me-2">
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="warning" href={`/jobs/edit/${job.id}`} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={() => deleteJob(job.id)}>Delete</Button>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
        {isAdmin && (
          <Col md={4}>
            <h2>Post a Sponsorship Visa Job</h2>
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
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
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
                <DynamicReactQuill 
                  theme="snow" 
                  value={jobDetail} 
                  onChange={setJobDetail} 
                  style={{ height: '200px', marginBottom: '50px' }} 
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
