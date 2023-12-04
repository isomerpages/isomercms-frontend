import { Box, Image } from "@chakra-ui/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useParams } from "react-router-dom"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"

export const ImageView = ({ node }: NodeViewProps) => {
  const { siteName } = useParams<{ siteName: string }>()
  const isExternalImage = node.attrs.src.startsWith("https://")
  const mediaSrcs = isExternalImage
    ? new Set<string>([])
    : new Set<string>([node.attrs.src])

  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })

  let imgSrc = isExternalImage ? node.attrs.src : "/placeholder_no_image.png"
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
