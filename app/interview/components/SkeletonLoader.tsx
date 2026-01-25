import { Box, Stack, SimpleGrid } from "@chakra-ui/react";
import SectionCard from "../_components/ui/SectionCard";


const pulse = "pulse 2s ease-in-out infinite";

export function SkeletonLoader() {
  return (
    <Stack gap="6">
      <SectionCard>
        <Stack gap="3">
          <Box h="6" w="32" bg="blue.100" borderRadius="md" animation={pulse} />
          <Box h="4" bg="gray.100" borderRadius="md" animation={pulse} />
          <Box
            h="4"
            w="85%"
            bg="gray.100"
            borderRadius="md"
            animation={pulse}
          />
          <Box
            h="4"
            w="66%"
            bg="gray.100"
            borderRadius="md"
            animation={pulse}
          />
        </Stack>
      </SectionCard>
      <SectionCard>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
          {[...Array(6)].map((_, i) => (
            <Stack key={i} gap="2">
              <Box
                h="4"
                w="24"
                bg="blue.100"
                borderRadius="md"
                animation={pulse}
              />
              <Box h="2" bg="gray.100" borderRadius="md" animation={pulse} />
              <Box
                h="3"
                w="85%"
                bg="gray.100"
                borderRadius="md"
                animation={pulse}
              />
            </Stack>
          ))}
        </SimpleGrid>
      </SectionCard>
    </Stack>
  );
}
