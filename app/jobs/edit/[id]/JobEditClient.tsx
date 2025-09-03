'use client';

import { Container, Form, Button } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (jobImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        editJob({
          id: job.id,
          title: jobTitle,
          company: companyName,
          location: location,
          description: description,
          image: reader.result as string,
          createdAt: job.createdAt,
        });
        router.push(`/jobs/${job.id}`);
      };
      reader.readAsDataURL(jobImageFile);
    } else {
      editJob({
        id: job.id,
        title: jobTitle,
        company: companyName,
        location: location,
        description: description,
        image: image, // Keep existing image if no new file is uploaded
        createdAt: job.createdAt,
      });
      router.push(`/jobs/${job.id}`);
    }
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
          <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobImageFile(e.target.files ? e.target.files[0] : null)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Job
        </Button>
      </Form>
    </Container>
  );
}
