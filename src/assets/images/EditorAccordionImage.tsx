export const EditorAccordionImage = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="48" height="48" fill="white" />
      <rect x="5" y="7" width="38" height="8" fill="#E8E8E8" />
      <rect x="5" y="24" width="38" height="8" fill="#E8E8E8" />
      <rect x="5" y="34" width="38" height="8" fill="#E8E8E8" />
      <path
        d="M37.0977 11.431L37.569 11.9024L39 10.4714L40.431 11.9024L40.9023 11.431L39 9.52869L37.0977 11.431Z"
        fill="#666C7A"
      />
      <path
        d="M40.9023 27.569L40.431 27.0976L39 28.5286L37.569 27.0976L37.0977 27.569L39 29.4713L40.9023 27.569Z"
        fill="#666C7A"
      />
      <path
        d="M40.9023 37.569L40.431 37.0976L39 38.5286L37.569 37.0976L37.0977 37.569L39 39.4713L40.9023 37.569Z"
        fill="#666C7A"
      />
    </svg>
  )
}
