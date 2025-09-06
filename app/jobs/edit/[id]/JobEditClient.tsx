'use client';

import { Container, Form, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { JobContext } from '../../../../context/JobContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface JobEditClientProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    image?: string | null;
    createdAt: Date;
  };
}

export default function JobEditClient({ job }: JobEditClientProps) {
  const { editJob } = useContext(JobContext)!;
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState(job.title);
  const [companyName, setCompanyName] = useState(job.company);
  const [location, setLocation] = useState(job.location);
  const [description, setDescription] = useState(job.description);
  const [image, setImage] = useState(job.image);
  const [jobImageFile, setJobImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setJobImageFile(null);
    setImageError(null);

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 3 * 1024 * 1024; // 3MB

      if (!allowedTypes.includes(file.type)) {
        setImageError('Invalid file type. Only JPG, PNG, and GIF images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setImageError('Image size exceeds 3MB limit.');
        return;
      }

      setJobImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageError) {
      alert('Please correct the image error before submitting.');
      return;
    }

    let imageUrl = image;

    if (jobImageFile) {
      const formData = new FormData();
      formData.append('file', jobImageFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        imageUrl = data.url;
      } catch (error) {
        setImageError('Failed to upload image. Please try again.');
        return;
      }
    }

    editJob({
      id: job.id,
      title: jobTitle,
      company: companyName,
      location: location,
      description: description,
      image: imageUrl,
      createdAt: job.createdAt,
    });
    router.push(`/jobs/${job.id}`);
  };

  return (
    <Container className="mt-5">
      <h1>Edit Job</h1>
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

        <Form.Group className="mb-3" controlId="formLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <DynamicReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ height: '200px', marginBottom: '50px' }}
          />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Job Advertisement Picture (optional)</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
          {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Job
        </Button>
      </Form>
    </Container>
  );
}

