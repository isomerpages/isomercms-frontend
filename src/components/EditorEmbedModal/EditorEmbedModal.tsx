import {
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Link,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import * as Cheerio from "cheerio"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as Yup from "yup"

import { useCspHook } from "hooks/settingsHooks"

import { isEmbedCodeValid } from "utils/allowedHTML"

import { EditorEmbedContents } from "types/editPage"

interface EditorEmbedModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: (embedCode: EditorEmbedContents) => void
  cursorValue: string
}

export const EditorEmbedModal = ({
  isOpen,
  onClose,
  onProceed,
  cursorValue,
}: EditorEmbedModalProps): JSX.Element => {
  const { data: csp } = useCspHook()

  const handleSubmit = (embedCode: EditorEmbedContents) => {
    const { value } = embedCode
    const $ = Cheerio.load(value)

    if ($("blockquote").hasClass("instagram-media")) {
      const postUrl = $(".instagram-media").attr("data-instgrm-permalink")
      const url = document.createElement("a")
      url.href = postUrl || ""
      const code = `<iframe src="https://${url.host}${url.pathname}embed/" frameborder="0" allowfullscreen="true" width="320" height="440"></iframe>`
      onProceed({ value: code })
    } else {
      onProceed(embedCode)
    }
  }

  const methods = useForm<EditorEmbedContents>({
    mode: "onTouched",
    resolver: yupResolver(
      Yup.object().shape({
        value: Yup.string()
          .required(
            "Content to embed cannot be empty. Please enter valid HTML code."
          )
          .matches(
            // Blockquote is to allow for Instagram embeds
            /^(<iframe |<blockquote |<div)(.*)$/s,
            "Please enter a valid embed code"
          )
          .test({
            name: "isEmbedCodeValid",
            message:
              "This content is not supported yet, or there is unauthorised Javascript in your code. Ensure that you have valid HTML code and try again.",
            test: (value) => isEmbedCodeValid(csp, value),
          }),
      })
    ),
    defaultValues: {
      value: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      methods.setValue(
        "value",
        cursorValue
          .replace('<div class="iframe-wrapper">', "")
          .replace('<div class="formsg-wrapper">', "")
          // Remove the closing div tag
          .slice(0, -6)
      )
    } else {
      methods.reset()
    }
  }, [cursorValue, isOpen, methods])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              {cursorValue === ""
                ? "Embed new content"
                : "Edit embedded content"}
            </ModalHeader>

            <ModalBody>
              <Text textStyle="body-1" mt="1rem">
                You can embed selected external content on your page.{" "}
                <Link
                  target="_blank"
                  href="https://guide.isomer.gov.sg/guide/integration#embedding"
                >
                  Click here
                </Link>{" "}
                to learn more about embedding content onto your Isomer site.
              </Text>
              <FormControl
                isRequired
                isInvalid={!!methods.formState.errors.value}
              >
                <FormLabel textStyle="subhead-1" mt="1.5rem" mb="0.5rem">
                  Code to embed
                </FormLabel>

                <Textarea
                  placeholder="Paste your code in here. It might start with a <iframe> or <blockquote> tag."
                  mt={0}
                  fontFamily="monospace"
                  size="md"
                  height="9rem"
                  color="green.400"
                  {...methods.register("value")}
                />

                {methods.formState.errors.value ? (
                  <FormErrorMessage mb={0}>
                    {methods.formState.errors.value.message}
                  </FormErrorMessage>
                ) : (
                  <Text textStyle="body-2" mt="0.5rem">
                    Isomer does not support any unauthorised content that
                    violates the Content Security Policy (CSP).
                  </Text>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter mt="0.5rem">
              <HStack w="100%" spacing={4} justifyContent="flex-end">
                {cursorValue !== "" && (
                  <Button
                    variant="clear"
                    colorScheme="neutral"
                    onClick={() => {
                      methods.reset()
                      onClose()
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" isDisabled={!methods.formState.isValid}>
                  {cursorValue === "" ? "Add to page" : "Save"}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </FormProvider>
    </Modal>
  )
}
