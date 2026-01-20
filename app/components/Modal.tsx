"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { X } from "lucide-react";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  panelClassName?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  panelClassName = "",
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" style={{ position: 'relative', zIndex: 50 }} onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              transition: 'opacity',
            }}
            aria-hidden="true"
          />
        </TransitionChild>

        {/* Modal panel wrapper - allows clicks to pass through */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'auto' }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                data-testid="modal-panel"
                className={panelClassName}
              >
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="2xl"
                  maxW={{ base: "90vw", sm: "2xl", md: "4xl", lg: "5xl" }}
                  w="full"
                  maxH="85vh"
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    px={{ base: 8, sm: 10 }}
                    py={{ base: 6, sm: 7 }}
                    borderBottomWidth={title ? "1px" : "0"}
                    borderColor="gray.200"
                  >
                    <DialogTitle
                      as={Heading}
                      fontSize={{ base: "lg", sm: "xl" }}
                      fontWeight="semibold"
                      color="gray.900"
                    >
                      {title}
                    </DialogTitle>
                    <IconButton
                      onClick={onClose}
                      aria-label="Close"
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: "gray.600" }}
                      transition="colors 0.2s"
                    >
                      <X size={24} />
                    </IconButton>
                  </Flex>

                  {/* Body */}
                  <Box
                    flex="1"
                    overflowY="auto"
                    px={{ base: 8, sm: 10 }}
                    py={{ base: 6, sm: 8 }}
                  >
                    {children}
                  </Box>
                </Box>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
