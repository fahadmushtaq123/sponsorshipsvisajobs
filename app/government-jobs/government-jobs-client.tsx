'use client';

import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { JobContext } from '../../context/JobContext';
import { AuthContext } from '../../context/AuthContext';
import ImageModal from '../../components/ImageModal';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function GovernmentJobsClient() {
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
  const [imageError, setImageError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setJobImage(null); // Clear previous file
    setImageError(null); // Clear previous error

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 3 * 1024 * 1024; // 3MB

      if (!allowedTypes.includes(file.type)) {
        setImageError('Invalid file type. Only JPG, PNG, and GIF images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setImageError('Image size exceeds 5MB limit.');
        return;
      }

      setJobImage(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageError) {
      alert('Please correct the image error before submitting.');
      return;
    }

    if (jobImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addJob({
          title: jobTitle,
          company: companyName,
          location: `${city}, ${country} Government`,
          description: jobDetail,
          image: reader.result as string,
        });
      };
      reader.onerror = () => {
        setImageError('Failed to read image. Please try again.');
      };
      reader.readAsDataURL(jobImage);
    } else {
      addJob({
        title: jobTitle,
        company: companyName,
        location: `${city}, ${country} Government`,
        description: jobDetail,
        image: null,
      });
    }
    setJobTitle('');
    setCompanyName('');
    setCity('');
    setJobDetail('');
    setJobImage(null);
    setImageError(null);
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
                <Card.Subtitle className="mb-2 text-muted"><b>Company:</b> {job.company}</Card.Subtitle>
                <Card.Text><b>City:</b> {job.location}</Card.Text>
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
                <DynamicReactQuill 
                  theme="snow" 
                  value={jobDetail} 
                  onChange={setJobDetail} 
                  style={{ height: '200px', marginBottom: '50px' }} 
                />
              </Form.Group>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Job Advertisement Picture</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
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
