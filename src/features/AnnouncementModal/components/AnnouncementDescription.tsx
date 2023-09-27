import { Link, Text } from "@chakra-ui/react"

export const AnnouncementDescription = (): JSX.Element => {
  return (
    <>
      <Text textStyle="body-1" color="base.content.default">
        Make your website stand out with new layout options. For technical
        reasons, this feature is only available to users using email to log in.
      </Text>
      <Text textStyle="body-1" color="base.content.default" mt="1rem">
        <Link href="mailto:support@isomer.gov.sg">Contact us</Link> to
        understand more about getting access to new features like this.
      </Text>
    </>
  )
}
