'use client';

import { Container, Card, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { JobContext } from '../../context/JobContext';
import Link from 'next/link';

export default function JobCategories() {
  const context = useContext(JobContext);
  const [selectedCountry, setSelectedCountry] = useState('All');

  if (!context) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const { jobs } = context;

  const filteredJobs = selectedCountry === 'All' 
    ? jobs 
    : jobs.filter(job => job.location.includes(selectedCountry));

  const jobTitles = [...new Set(filteredJobs.map(job => job.title))];

  return (
    <Container className="mt-5" style={{ backgroundImage: "url(/compressed/common-bg.png)", backgroundSize: 'cover' }}>
      <h1 className="text-center mb-4">Job Categories</h1>
      <div className="text-center mb-4">
        <ButtonGroup>
          <Button variant={selectedCountry === 'All' ? 'primary' : 'secondary'} onClick={() => setSelectedCountry('All')}>All</Button>
          <Button variant={selectedCountry === 'Pakistan' ? 'primary' : 'secondary'} onClick={() => setSelectedCountry('Pakistan')}>Pakistan</Button>
          <Button variant={selectedCountry === 'Government' ? 'primary' : 'secondary'} onClick={() => setSelectedCountry('Government')}>Government</Button>
        </ButtonGroup>
      </div>
      <Row>
        {jobTitles.map((title, index) => (
          <Col md={4} key={index} className="mb-4">
            <Link href={`/?title=${encodeURIComponent(title)}`} passHref style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>{title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}