interface InfoBoxFormFields {
  title: string
  description?: string
}

interface InfoColsSectionFormFields {
  title: string
  subtitle?: string
  url?: string
  linktext?: string
  infoboxes: InfoBoxFormFields[]
}

interface InfoColsSectionProps extends InfoColsSectionFormFields {
  index: number
  errors: Omit<InfoColsSectionFormFields, "infoboxes">
  infoBoxErrors: InfoBoxFormFields[]
}

export const InfoColsSectionBody = ({
  title,
  subtitle,
  url,
  linktext,
  infoboxes = [],
  index,
  errors,
  infoBoxErrors = [],
}: InfoColsSectionProps) => {
  return <h1>Hello World</h1>
}
