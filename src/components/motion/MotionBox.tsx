import { Box, BoxProps } from "@chakra-ui/react"
import { HTMLMotionProps, motion } from "framer-motion"
import { FC } from "react"
import type { Merge } from "type-fest"

export type MotionBoxProps = Merge<BoxProps, HTMLMotionProps<"div">>
export const MotionBox: FC<MotionBoxProps> = motion(Box)
