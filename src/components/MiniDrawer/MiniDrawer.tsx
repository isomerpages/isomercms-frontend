import { BoxProps, Slide, SlideProps } from "@chakra-ui/react"

type MiniDrawerProps = SlideProps & {
  isOpen: boolean
  width?: BoxProps["width"]
}

export const MiniDrawer = ({
  isOpen,
  width,
  children,
  ...rest
}: MiniDrawerProps): JSX.Element => {
  return (
    <Slide
      direction="left"
      in={isOpen}
      style={{
        zIndex: 10,
        position: "absolute",
        top: "0",
        left: "0",
        width: (width as string) || "100%",
      }}
      {...rest}
    >
      {children}
    </Slide>
  )
}
