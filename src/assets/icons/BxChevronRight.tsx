// eslint-disable-next-line import/prefer-default-export
export const BxChevronRight = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <path d="M10.707 17.707L16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
    </svg>
  )
}
