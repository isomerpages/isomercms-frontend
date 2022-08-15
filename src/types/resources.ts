export type ResourcesRouteParams =
  | ResourceRoomRouteParams
  | ResourceCategoryRouteParams

export interface ResourceRoomRouteParams {
  siteName: string
  resourceRoomName: string
}

export interface ResourceCategoryRouteParams extends ResourceRoomRouteParams {
  resourceCategoryName: string
}

export interface ResourceRoomOptions {
  resourceRoomName: string
  resourceCategoryName: string
  isCreate: boolean
}
