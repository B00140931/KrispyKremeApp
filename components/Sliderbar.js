import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Button, Link, Text, styled } from "@nextui-org/react";

const StyledImg = styled("img", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});

const StyledButton = styled("button", {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  '&:active': {
    opacity: 0.8,
  }
});

const Box = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 20px",
  borderRadius: "5px",
  background: "#f0f0f0",
  '&:hover': {
    background: "#e0e0e0",
  }
});

export default function Sliderbar() {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch user role and login status from the session or global state
    const fetchUserData = async () => {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        if (user) {
          setIsLoggedIn(true);
          if (user.type === 'manager') {
            setIsManager(true);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.reload(); // refresh the page to update
  };

  return (
    <Navbar isBordered variant="sticky" css={{ zIndex: 1000 }}>
      <Navbar.Brand>
        <Link href="/">
          <StyledImg src="/img/Krispy-Kreme-Logo.png" height={70} alt="Krispy Kreme Logo" />
        </Link>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="underline">
        <Navbar.Link href="/customer">
          <Box>
            <Text css={{ color: 'darkgreen', fontWeight: "bold" }}>Menu</Text>
          </Box>
        </Navbar.Link>
        <Navbar.Link href="/cart">
          <StyledButton aria-label="Cart">
            <Box>
              <Text css={{ color: 'darkgreen', fontWeight: "bold" }}>Cart</Text>
            </Box>
          </StyledButton>
        </Navbar.Link>
        {isManager && (
          <Navbar.Link href="/manager">
            <Box>
              <Text css={{ color: 'darkgreen', fontWeight: "bold" }}>Manager</Text>
            </Box>
          </Navbar.Link>
        )}
      </Navbar.Content>
      <Navbar.Content>
        {isLoggedIn ? (
          <Navbar.Item>
            <Button auto flat css={{ background: 'none', color: 'red' }} onClick={handleLogout}>
              <Text css={{ color: 'red', fontWeight: "bold" }}>Logout</Text>
            </Button>
          </Navbar.Item>
        ) : (
          <>
            <Navbar.Item>
              <Button auto flat css={{ background: 'none', color: 'red' }} onClick={handleLogin}>
                <Text css={{ color: 'red', fontWeight: "bold" }}>Login</Text>
              </Button>
            </Navbar.Item>
            <Navbar.Item>
              <Button auto flat css={{ background: 'darkgreen', color: 'white' }} as={Link} href="/register">
                Register
              </Button>
            </Navbar.Item>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
}
