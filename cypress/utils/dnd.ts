import { REACT_DRAG_HANDLE_PROPERTY } from "../fixtures/selectors/dnd"

export const getHandleSelector = (draggableId?: string) => {
  if (draggableId) {
    return `[${REACT_DRAG_HANDLE_PROPERTY}="${draggableId}"]`
  }
  return `[${REACT_DRAG_HANDLE_PROPERTY}]`
}
