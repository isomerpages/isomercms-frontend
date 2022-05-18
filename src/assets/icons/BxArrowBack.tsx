// eslint-disable-next-line import/prefer-default-export
export const BxArrowBack = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      style={{ fill: "rgba(255, 255, 255, 1)", transform: ";msFilter:;" }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
    </svg>
  )
}
