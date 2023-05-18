export interface SinglePageNav {
  title: string
  url?: string
}

export interface CollectionNav {
  title: string
  collection: string
}

export interface ResourceNav {
  title: string
  // eslint-disable-next-line camelcase
  resource_room: true
}

export interface SubmenuNav extends SinglePageNav {
  sublinks: SinglePageNav[]
}

export interface NavDto {
  content: {
    logo?: string
    links: (SinglePageNav | CollectionNav | ResourceNav | SubmenuNav)[]
  }
  sha: string
}
