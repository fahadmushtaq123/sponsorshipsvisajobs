
'use client';

import { useContext, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { JobContext } from '../../../context/JobContext';
import { useParams } from 'next/navigation';
import ImageModal from '../../../components/ImageModal';

export default function JobDetails() {
  const context = useContext(JobContext);
  const params = useParams();
  const jobId = params.id;

  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  if (!context) {
    return <div>Loading...</div>;
  }

  const { jobs } = context;
  const job = jobs.find(j => j.id === Number(jobId));

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
