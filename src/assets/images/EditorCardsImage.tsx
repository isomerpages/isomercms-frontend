export const EditorCardsImage = (
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
      <rect x="4" y="15" width="12" height="8" fill="#E8E8E8" />
      <rect x="18" y="15" width="12" height="8" fill="#E8E8E8" />
      <rect x="32" y="15" width="12" height="8" fill="#E8E8E8" />
      <rect x="4" y="25" width="12" height="8" fill="#E8E8E8" />
      <rect x="18" y="25" width="12" height="8" fill="#E8E8E8" />
      <rect x="32" y="25" width="12" height="8" fill="#E8E8E8" />
    </svg>
  )
}
