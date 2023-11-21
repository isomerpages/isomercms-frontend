import { Box, Image } from "@chakra-ui/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useParams } from "react-router-dom"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"

export const ImageView = ({ node }: NodeViewProps) => {
  const { siteName } = useParams<{ siteName: string }>()
  const mediaSrcs = new Set<string>([node.attrs.src])

  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })

  let imgSrc = "/placeholder_no_image.png"
  if (mediaData && mediaData.length > 0) {
    // Guarenteed to be the first element since we only passed in one mediaSrc
    imgSrc = mediaData[0].mediaUrl
  }
  return (
    <Box as={NodeViewWrapper} data-drag-handle>
      <Image src={imgSrc} />
    </Box>
  )
}
