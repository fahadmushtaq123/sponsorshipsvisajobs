'use client';

import { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Blog } from '../../../context/BlogContext';
import { useParams } from 'next/navigation';

const BlogPage = () => {
  const params = useParams();
  const slug = params.slug;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        {blog.image && (
          <Card.Img
            variant="top"
            src={blog.image}
            style={{ width: blog.imageWidth || '100%', height: blog.imageHeight || 'auto', objectFit: 'contain' }}
          />
        )}
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Text as="div" dangerouslySetInnerHTML={{ __html: blog.description }} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogPage;
