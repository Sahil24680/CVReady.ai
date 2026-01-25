import { Box, HStack, Text } from "@chakra-ui/react";
import { CheckCircle2, LucideIcon } from "lucide-react";

interface ListItemProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  iconSize?: number;
}

export function IconListItem({
  children,
  icon: Icon = CheckCircle2,
  iconColor = "var(--chakra-colors-blue-600)",
  iconSize = 20,
}: ListItemProps) {
  return (
    <HStack as="li" align="flex-start" gap="2">
      <Box mt="0.5" flexShrink={0}>
        <Icon size={iconSize} color={iconColor} />
      </Box>
      <Text>{children}</Text>
    </HStack>
  );
}

interface BulletPointProps {
  children: React.ReactNode;
  color: string;
}

export function BulletPoint({ children, color }: BulletPointProps) {
  return (
    <HStack align="flex-start" gap="3">
      <Box mt="2" w="2" h="2" bg={color} borderRadius="full" flexShrink={0} />
      <Text fontSize="sm" color="gray.700">
        {children}
      </Text>
    </HStack>
  );
}
