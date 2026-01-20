import { Box, Flex, Text, HStack } from "@chakra-ui/react";

interface CommentCardProps {
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
}

export default function CommentCard({ name, role, company, comment, rating }: CommentCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Box
      flexShrink={0}
      w="80"
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      p="6"
      _hover={{ boxShadow: "md" }}
      transition="box-shadow 0.3s"
    >
      <Flex align="flex-start" gap="4">
        <Flex
          w="12"
          h="12"
          bg="#06367a"
          borderRadius="full"
          align="center"
          justify="center"
          color="white"
          fontWeight="semibold"
          fontSize="sm"
          flexShrink={0}
        >
          {initials}
        </Flex>
        <Box flex="1" minW="0">
          <Flex align="center" gap="2" mb="1">
            <Text as="h4" fontWeight="semibold" color="gray.900" fontSize="sm" isTruncated>
              {name}
            </Text>
            <Flex align="center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  color={i < rating ? '#60A5FA' : 'gray.200'}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </Flex>
          </Flex>
          <Text fontSize="xs" color="gray.500" mb="2">
            {role} {company}
          </Text>
          <Text fontSize="sm" color="gray.700" lineHeight="relaxed">
            {comment}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
