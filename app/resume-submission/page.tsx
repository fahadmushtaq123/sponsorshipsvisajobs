'use client';

import React, { useState } from 'react';

export default function ResumeSubmissionPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setResumeFile(null); // Clear previous file
    setFileError(null); // Clear previous error

    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 4 * 1024 * 1024; // 4MB

      if (!allowedTypes.includes(file.type)) {
        setFileError('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setFileError('File size exceeds 10MB limit.');
        return;
      }

      setResumeFile(file);
    }
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setScreenshotFile(null); // Clear previous file
    setScreenshotError(null); // Clear previous error

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Common image types
      const maxSize = 3 * 1024 * 1024; // 3MB

      if (!allowedTypes.includes(file.type)) {
        setScreenshotError('Invalid file type. Only JPG, PNG, and GIF images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setScreenshotError('Screenshot size exceeds 5MB limit.');
        return;
      }

      setScreenshotFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resumeFile && !fileError && screenshotFile && !screenshotError) {
      const formData = new FormData();
      formData.append('firstName', (document.getElementById('firstName') as HTMLInputElement).value);
      formData.append('secondName', (document.getElementById('secondName') as HTMLInputElement).value);
      formData.append('profession', (document.getElementById('profession') as HTMLInputElement).value);
      formData.append('resume', resumeFile);
      formData.append('screenshot', screenshotFile);

      try {
        const response = await fetch('/api/submit-resume', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Resume and Screenshot submitted successfully!');
          // Optionally, clear the form or redirect
        } else {
          const errorData = await response.json();
          alert(`Submission failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An unexpected error occurred during submission.');
      }
    } else {
      alert('Please correct the errors before submitting.');
    }
  };

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', textAlign: 'center', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <p style={{ color: '#333', marginBottom: '15px', lineHeight: '1.6' }}>
          We will personally send your resume to 1,000+ top companies on your behalf, giving you maximum exposure and a higher chance of getting noticed by the right employers.
        </p>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0', textAlign: 'left', color: '#555', display: 'inline-block' }}>
          <li style={{ marginBottom: '8px' }}>✅ Save time & effort</li>
          <li style={{ marginBottom: '8px' }}>✅ Reach thousands of potential employers instantly</li>
          <li style={{ marginBottom: '8px' }}>✅ Increase your chances of job interviews</li>
          <li style={{ marginBottom: '8px' }}>✅ Perfect for fresh graduates & professionals</li>
        </ul>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <a href="/20k-companies" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>20k Companies</a>
          <a href="/successful-clients" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>Our Successful Clients</a>
        </div>
      </div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px', marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center', color: '#721c24' }}>Payment Instructions</h2>
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Please pay $2 (or 560 PKR) to one of the following accounts:</p>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '16px', margin: '0' }}><strong>JazzCash Account Number:</strong> 03024118228</p>
            <p style={{ fontSize: '16px', margin: '0' }}><strong>Account Holder Name:</strong> Fahad Mushtaq</p>
            <hr />
            <p style={{ fontSize: '16px', margin: '0' }}><strong>Allied Bank Account Number:</strong> 07740010097092900019</p>
            <p style={{ fontSize: '16px', margin: '0' }}><strong>Account Holder Name:</strong> Fahad Mushtaq</p>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>After payment, please take a screenshot of the transaction and upload it in the form below.</p>
        </div>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Resume Submission</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>First Name:</label>
            <input type="text" id="firstName" name="firstName" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} required />
          </div>
          <div>
            <label htmlFor="secondName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Second Name:</label>
            <input type="text" id="secondName" name="secondName" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} required />
          </div>
          <div>
            <label htmlFor="profession" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Profession:</label>
            <input type="text" id="profession" name="profession" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} required />
          </div>
          <div>
            <label htmlFor="resume" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Upload Resume:</label>
            <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} required />
            {fileError && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{fileError}</p>}
          </div>
          <div>
            <label htmlFor="screenshot" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Money Transfer Screenshot:</label>
            <input type="file" id="screenshot" name="screenshot" accept="image/jpeg,image/png,image/gif" onChange={handleScreenshotChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} required />
            {screenshotError && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{screenshotError}</p>}
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '20px' }}>Submit Resume</button>
        </form>
      </div>
    </>
  );
}
