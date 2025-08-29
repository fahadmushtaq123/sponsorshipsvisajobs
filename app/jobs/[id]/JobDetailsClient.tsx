'use client';

import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import ImageModal from '../../../components/ImageModal';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
}

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          const response = await fetch(`/api/jobs?id=${jobId}`);
          if (!response.ok) {
            throw new Error('Job not found');
          }
          const data = await response.json();
          setJob(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchJobDetails();
    }
  }, [jobId]);

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/common-bg.png)", backgroundSize: 'cover' }}>
      <Card>
        {job.image && 
          <Card.Img 
            variant="top" 
            src={job.image} 
            style={{ maxWidth: '300px', cursor: 'pointer' }} 
            onClick={() => handleImageClick(job.image as string)} 
          />
        }
        <Card.Body>
          <Card.Title>{job.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
          <Card.Text>{job.location}</Card.Text>
          <Card.Text>{job.description}</Card.Text>
        </Card.Body>
      </Card>
      <ImageModal show={showModal} onHide={() => setShowModal(false)} imageUrl={modalImageUrl} />
    </Container>
  );
}