export const EditorDividerImage = (
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
      <line x1="6" y1="24" x2="42" y2="24" stroke="#BFC2C8" strokeWidth="2" />
    </svg>
  )
}
