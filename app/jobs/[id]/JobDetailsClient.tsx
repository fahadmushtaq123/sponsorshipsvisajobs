
'use client';

import { useContext, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { JobContext } from '../../../context/JobContext';
import { useParams } from 'next/navigation';
import ImageModal from '../../../components/ImageModal';

export default function JobDetails() {
  const context = useContext(JobContext);
  const params = useParams();
  const jobId = params.id;

  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  if (!context) {
    return <div>Loading...</div>;
  }

  const { jobs, loading } = context;

  if (loading) {
    return <div>Loading...</div>;
  }

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title>{job.title}</Card.Title>
            <Button variant="outline-primary" onClick={handleShare}>
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
          <Card.Subtitle className="mb-2 text-muted"><b>Company:</b> {job.company}</Card.Subtitle>
          <Card.Text><b>City:</b> {job.location}</Card.Text>
          <Card.Text dangerouslySetInnerHTML={{ __html: job.description }} />
        </Card.Body>
      </Card>
      <ImageModal show={showModal} onHide={() => setShowModal(false)} imageUrl={modalImageUrl} />
    </Container>
  );
}
