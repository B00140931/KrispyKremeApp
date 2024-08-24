import { Grid, Card, Text, Container } from "@nextui-org/react";
import { Input, Button, Row } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { useState } from 'react';
import sanitizeHtml from 'sanitize-html';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Prevent more than 50 characters
    if (!formData.username || formData.username.length > 50) {
      setError('Username is required and must be less than 50 characters.');
      return;
    }

    if (!formData.password || formData.password.length > 50) {
      setError('Password is required and must be less than 50 characters!');
      return;
    }

    const sanitizedData = {
      username: sanitizeHtml(formData.username),
      password: sanitizeHtml(formData.password),
    };
    const JSONdata = JSON.stringify(sanitizedData);
    const endpoint = '/api/login';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (response.ok) {
      if (result.user && result.user.type === 'manager') {
        router.push('/manager');
      } else {
        router.push('/customer');
      }
    } else {
      setError(result.error || 'Login failed');
    }
  }

  function handleChange(event) {
    const { id, value } = event.target;
    const sanitizedValue = sanitizeHtml(value).substring(0, 50);

    setFormData((prevData) => ({
      ...prevData,
      [id]: sanitizedValue
    }));

    setError('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container xs={650} gap={2}>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              <Grid justify='center' xs={12} md={6}>
                <Text h4 color="red" size={20} css={{ m: 20 }}>LOGIN</Text>
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
                onChange={handleChange} // Handle password change here
              />
            </Card.Body>
          </Card>
        </Row>
        <Row gap={1}>
          <Card css={{ $$cardColor: 'none' }}>
            <Card.Body>
              {error && <Text color="red">{error}</Text>}
              <Button auto css={{ background: 'darkgreen', color: 'white' }} type="submit">Login</Button>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </form>
  );
}
