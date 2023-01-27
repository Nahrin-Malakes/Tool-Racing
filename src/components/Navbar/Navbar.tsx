import type { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { signOut, useSession } from "next-auth/react";
import { CreateTicket } from "../CreateTicket/CreateTicket";

const Links = [{ name: "Dashboard", href: "/" }];

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: "gray.700",
    }}
    href={href}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={"gray.900"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Garager</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                leftIcon={<AddIcon />}
              >
                Action
              </MenuButton>
              <MenuList>
                <CreateTicket />
                <MenuItem>Link 2</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  referrerPolicy="no-referrer"
                  size={"sm"}
                  src={sessionData?.user?.image as string}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem
                  textColor={"red.500"}
                  onClick={() =>
                    void signOut({
                      redirect: true,
                      callbackUrl: "/api/auth/signin",
                    })
                  }
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

