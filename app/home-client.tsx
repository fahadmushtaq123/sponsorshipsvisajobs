'use client';

import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { useContext, useState, useEffect, Suspense, useMemo } from 'react';
import { JobContext } from '../context/JobContext';
import { ScholarshipContext } from '../context/ScholarshipContext';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../components/SplashScreen';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { JOBS_PER_PAGE } from '../lib/config';

const DynamicSplashScreen = dynamic(() => import('../components/SplashScreen'), {
  ssr: false, // Ensure it's only loaded on the client side
});

function JobsList({ jobs, scholarships, isAdmin, deleteJob }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  const filteredJobs = useMemo(() => {
    let filtered = title ? jobs.filter(job => job.title === title) : jobs;
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [jobs, title, searchTerm]);

  const governmentJobsCount = useMemo(() => jobs.filter(job => job.location && job.location.toLowerCase().includes('government')).length, [jobs]);
  const sponsorshipJobsCount = useMemo(() => jobs.filter(job => job.location && job.location.toLowerCase().includes('sponsorship')).length, [jobs]);
  const scholarshipsCount = useMemo(() => scholarships.length, [scholarships]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is now handled by the useMemo hook, so we just need to update the search term
  };

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">{ title ? `Jobs for "${title}"` : "Find Your Next Sponsorship Visa Job"}</h1>
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Form onSubmit={handleSearch}>
              <Row>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    placeholder="Search for jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Button variant="primary" type="submit" className="w-100">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className="mb-4 text-center">
          <Col>
            <Link href="/government-jobs" passHref style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>Government Jobs</Card.Title>
                  <Card.Text>{governmentJobsCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col>
            <Link href="/sponsorship-jobs" passHref style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>Sponsorship Visa Jobs</Card.Title>
                  <Card.Text>{sponsorshipJobsCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col>
            <Link href="/scholarships" passHref style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>Scholarships</Card.Title>
                  <Card.Text>{scholarshipsCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
        <Row>
          {currentJobs.map((job) => (
            <Col md={4} key={job.id} className="mb-4">
              <Card as="article">
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                  <Card.Text>{job.location}</Card.Text>
                  <Card.Text><small className="text-muted">Posted on: {new Date(job.createdAt).toLocaleDateString()}</small></Card.Text>
                  <Button variant="primary" href={`/jobs/${job.id}`} className="me-2">View Details</Button>
                  {isAdmin && (
                    <>
                      <Button variant="warning" href={`/jobs/edit/${job.id}`} className="me-2">Edit</Button>
                      <Button variant="danger" onClick={() => deleteJob(job.id)}>Delete</Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="justify-content-center">
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                {page}
              </Pagination.Item>
            ))}
          </Pagination>
        </Row>
      </Container>
    </main>
  );
}

function HomeClientWithData() {
  const jobContext = useContext(JobContext);
  const scholarshipContext = useContext(ScholarshipContext);
  const authContext = useContext(AuthContext);

  if (!jobContext || !scholarshipContext || !authContext) {
    return <DynamicSplashScreen />;
  }

  const { jobs, deleteJob, loading: jobsLoading } = jobContext;
  const { scholarships, loading: scholarshipsLoading } = scholarshipContext;
  const { isAdmin } = authContext;

  if (jobsLoading || scholarshipsLoading) {
    return <DynamicSplashScreen />;
  }

  return <JobsList jobs={jobs} scholarships={scholarships} isAdmin={isAdmin} deleteJob={deleteJob} />;
}

export default function HomeClient() {
  return (
    <Suspense fallback={<DynamicSplashScreen />}>
      <HomeClientWithData />
    </Suspense>
  );
}
