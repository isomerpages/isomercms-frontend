import { Text, VStack } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"
import { AddSectionButton } from "../Editable/AddSectionButton"

import { ContactCard, ContactCardFrontMatter } from "./ContactCard"
import { LocationCard, LocationCardFrontMatter } from "./LocationCard"

type ContactUsType = "locations" | "contacts"

type ContactUsLocationCardProps = {
  contactUsType: Extract<"locations", ContactUsType>
  cardFrontMatter: LocationCardFrontMatter[]
  errors: LocationCardFrontMatter[]
}

type ContactUsContactCardProps = {
  contactUsType: Extract<"contacts", ContactUsType>
  cardFrontMatter: ContactCardFrontMatter[]
  errors: ContactCardFrontMatter[]
}

type CardsSectionProps = ContactUsLocationCardProps | ContactUsContactCardProps

const CONTACTUS_SECTION_TITLE: Record<ContactUsType, string> = {
  locations: "Locations",
  contacts: "Contact Information",
}

const CONTACTUS_ADD_BUTTON_TITLE: Record<ContactUsType, string> = {
  locations: "Add location",
  contacts: "Add contact information",
}

const CONTACTUS_EMPTY_SECTION_TITLE: Record<ContactUsType, string> = {
  locations: "Locations you add will appear here",
  contacts: "Contact information you add will appear here",
}

const CONTACTUS_EMPTY_SECTION_SUBTITLE: Record<ContactUsType, string> = {
  locations: "Add locations to help site visitors reach you",
  contacts: "Add numbers and emails to help site visitors reach you",
}

export const CardsSection = ({
  contactUsType,
  cardFrontMatter,
  errors,
}: CardsSectionProps) => {
  const { onDragEnd, onCreate } = useEditableContext()

  return (
    <>
      <Text textStyle="h5">{CONTACTUS_SECTION_TITLE[contactUsType]}</Text>
      <DragDropContext onDragEnd={onDragEnd}>
        <Editable.Droppable width="100%" editableId={contactUsType}>
          <Editable.EmptySection
            title={CONTACTUS_EMPTY_SECTION_TITLE[contactUsType]}
            subtitle={CONTACTUS_EMPTY_SECTION_SUBTITLE[contactUsType]}
            isEmpty={cardFrontMatter.length === 0}
          >
            <VStack p={0} spacing="1.125rem">
              {cardFrontMatter.map((card, index) => (
                <>
                  {contactUsType === "locations" ? (
                    <LocationCard
                      index={index}
                      frontMatter={card as LocationCardFrontMatter}
                      errors={errors[index]}
                    />
                  ) : (
                    <ContactCard
                      index={index}
                      frontMatter={card as ContactCardFrontMatter}
                      errors={errors[index]}
                    />
                  )}
                </>
              ))}
            </VStack>
          </Editable.EmptySection>
        </Editable.Droppable>
      </DragDropContext>

      <AddSectionButton
        w="100%"
        id={contactUsType}
        buttonText={CONTACTUS_ADD_BUTTON_TITLE[contactUsType]}
        onClick={() =>
          onCreate({
            target: {
              id: contactUsType,
            },
          })
        }
      />
    </>
  )
}
