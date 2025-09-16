
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

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this job: ${job.title} at ${job.company}\n`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(job.title);
    const summary = encodeURIComponent(job.description); // Using job description as summary
    const source = encodeURIComponent(window.location.origin); // Your website's origin
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}&source=${source}`, '_blank');
  };

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
          </div>
          <Card.Subtitle className="mb-2 text-muted"><b>Company:</b> {job.company}</Card.Subtitle>
          <Card.Text><b>City:</b> {job.location}</Card.Text>
          <Card.Text dangerouslySetInnerHTML={{ __html: job.description }} />
          <div className="mt-3">
            <Button variant="outline-primary" onClick={handleShare} className="me-2">
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button variant="outline-primary" onClick={handleFacebookShare} className="me-2">
              Share on Facebook
            </Button>
            <Button variant="outline-success" onClick={handleWhatsAppShare} className="me-2">
              Share on WhatsApp
            </Button>
            <Button variant="outline-info" onClick={handleLinkedInShare}>
              Share on LinkedIn
            </Button>
          </div>
        </Card.Body>
      </Card>
      <ImageModal show={showModal} onHide={() => setShowModal(false)} imageUrl={modalImageUrl} />
    </Container>
  );
}
