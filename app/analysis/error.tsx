'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button, Heading, Stack } from '@chakra-ui/react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <Stack
      minH="100vh"
      align="center"
      justify="center"
      textAlign="center"
      fontSize="lg"
      fontWeight="black"
      color="red.800"
      gap="4"
    >
      <Heading as="h2" fontSize="2xl">
        Analysis failed!
      </Heading>
      <Button
        onClick={() => reset()}
        bg="red.600"
        color="white"
        px="4"
        py="2"
        borderRadius="md"
        transition="background 0.2s"
        _hover={{ bg: "red.700" }}
      >
        Try again
      </Button>
    </Stack>
  );
}
