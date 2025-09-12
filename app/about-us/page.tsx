import { Container } from 'react-bootstrap';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Our Mission to Connect Talent with Opportunity',
  description: 'Learn more about our job board and our mission to make the job search process easier and more efficient for everyone in Pakistan.',
};

export default function AboutUs() {
  return (
    <Container className="mt-5">
      <h1>About Us</h1>
      <p>Welcome to our jobs board! We are a passionate team of professionals dedicated to connecting talented individuals with great companies in Pakistan. Our mission is to bridge the gap between job seekers and employers, making the hiring process seamless and efficient.</p>

      <h2>Our Story</h2>
      <p>Founded in 2023, our platform was born out of the desire to create a centralized hub for job opportunities in Pakistan. We noticed the challenges that both job seekers and employers face in the local market, and we wanted to create a solution that would address these challenges. Our vision is to become the leading platform for sponsorship visa jobs in Pakistan, known for our quality listings and our commitment to helping people build successful careers.</p>

      <h2>Our Team</h2>
      <p>We are a diverse team of recruiters, software engineers, and marketing professionals with a shared passion for helping people find their dream jobs. We believe that our team's expertise and dedication are the driving force behind our success.</p>

      <h2>What We Do</h2>
      <p>We specialize in providing a comprehensive platform for job seekers to find the latest job opportunities across various industries in Pakistan. From government jobs to sponsorship visa jobs, we have a wide range of listings to suit every profile. We also offer valuable resources and career advice to help job seekers at every stage of their career.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions or feedback, please don't hesitate to <Link href="/contact-us">contact us</Link>.</p>
      <p><em>Please note: The content on this page is generated for demonstration purposes. We recommend replacing it with your own unique content.</em></p>
    </Container>
  );
}
