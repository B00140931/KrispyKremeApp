import React, { useState } from 'react';
import { Grid, Card, Text, Container, Input, Button, Row } from "@nextui-org/react";
import { useRouter } from 'next/router';
import sanitizeHtml from 'sanitize-html';
import validator from 'email-validator';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Length + validation to text fields
    if (!formData.username || formData.username.length > 50) {
      setError('Username is required and must be less than 50 characters.');
      return;
    }
    if (!formData.password || formData.password.length > 50) {
      setError('Password is required and must be less than 50 characters.');
      return;
    }

    // Ensure fields are not blank and apply validation
    if (!formData.username) {
      setError('Username is required.');
      return;
    }
    if (!formData.password) {
      setError('Password is required.');
      return;
    }
    if (!formData.email) {
      setError('Email is required.');
      return;
    }

    // Validate email format using email validator
    if (!validator.validate(formData.email)) {
      setError('Invalid email format!');
      return;
    }

    const sanitizedData = {
      username: sanitizeHtml(formData.username),
      password: sanitizeHtml(formData.password),
      email: sanitizeHtml(formData.email),
      type: 'customer' // default
    };

    const JSONdata = JSON.stringify(sanitizedData);
    const endpoint = '/api/register';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (response.ok) {
      alert('Registration successful');
      router.push('/login');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  // Handle input change with validation
  const handleChange = (event) => {
    const { id, value } = event.target;

    // Ensure the value is sanitized and not exceeding character limit
    const sanitizedValue = sanitizeHtml(value).substring(0, 50); // Limit to 50 chars

    setFormData((prevData) => ({
      ...prevData,
      [id]: sanitizedValue
    }));

    // Clear specific field error when user starts typing
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container xs={650} gap={2}>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              <Grid justify='center' xs={12} md={6}>
                <Text h4 color="red" size={20} css={{ m: 20 }}>
                  REGISTRATION
                </Text>
              </Grid>
            </Card.Body>
          </Card>
        </Row>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              <Input
                clearable
                label="Username"
                placeholder="Username"
                id='username'
                value={formData.username}
                onChange={handleChange}
                helperColor="error"
                helperText={error}
              />
            </Card.Body>
          </Card>
        </Row>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              <Input
                clearable
                label="Email"
                placeholder="Email Address"
                id="email"
                value={formData.email}
                onChange={handleChange}
                helperColor="error"
                helperText={error}
              />
            </Card.Body>
          </Card>
        </Row>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              <Input.Password
                clearable
                label="Password"
                placeholder="Enter your password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                helperColor="error"
                helperText={error}
              />
            </Card.Body>
          </Card>
        </Row>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              {error && <Text color="red">{error}</Text>}
              <Button auto css={{ background: 'darkgreen', color: 'white' }} type="submit">
                Create an Account
              </Button>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </form>
  );
}
