const testData = {
  directory: [
    // {
    //   type: 'page',
    //   link: '/contact-us/',
    // },
    // {
    //   type: 'page',
    //   link: '/about-us/',
    // },
    // {
    //   type: 'page',
    //   link: '/faq/',
    // },
    {
      type: 'collection',
      name: 'left-nav-one',
      collectionPages: [
        {
          path: '_left-nav-one%2F0-sub-page-A-test.md',
          fileName: '0-sub-page-A-test.md',
        },
        {
          path: '_left-nav-one%2F1-sub-page-B.md',
          fileName: '1-sub-page-B.md',
        },
      ],
    },
    {
      type: 'collection',
      name: 'left-nav-two',
      collectionPages: [
        {
          path: '_left-nav-two%2F0-sub-page-C.md',
          fileName: '0-sub-page-C.md'
        },
        {
          path: '_left-nav-two%2F1-sub-page-D.md',
          fileName: '1-sub-page-D.md',
        },
      ],
    },
    {
      type: 'collection',
      name: 'left-nav-three',
      collectionPages: [
        {
          path: '_left-nav-three%2F1-test.md',
          fileName: '1-test.md',
        },
      ],
    },
    // {
    //   type: 'resource room',
    //   title: 'Resource Room',
    // },
  ],
};

const cleanedData = {
  files: {
    '0-sub-page-A-test.md': {
      pageId: '0-sub-page-A-test.md',
      pagePath: '_left-nav-one%2F0-sub-page-A-test.md',
    },
    '1-sub-page-B.md': {
      pageId: '1-sub-page-B.md',
      pagePath: '_left-nav-one%2F1-sub-page-B.md',
    },
    '0-sub-page-C.md': {
      pageId: '0-sub-page-C.md',
      pagePath: '_left-nav-two%2F0-sub-page-C.md',
    },
    '1-sub-page-D.md': {
      pageId: '1-sub-page-D.md',
      pagePath: '_left-nav-two%2F1-sub-page-D.md',
    },
    '1-test.md': {
      pageId: '1-test.md', pagePath: '_left-nav-three%2F1-test.md',
    },
  },
  collections: {
    'left-nav-one': {
      collectionId: 'left-nav-one',
      pages: ['0-sub-page-A-test.md', '1-sub-page-B.md'],
    },
    'left-nav-two': {
      collectionId: 'left-nav-two',
      pages: ['0-sub-page-C.md', '1-sub-page-D.md'],
    },
    'left-nav-three': {
      collectionId: 'left-nav-three',
      pages: ['1-test.md'],
    },
  },
  collectionOrder: ['left-nav-one', 'left-nav-two', 'left-nav-three'],
};

function dragAndDropData(data) {
  const files = {};
  const collections = {};
  const collectionOrder = [];

  data.directory.forEach((input) => {
    if (input.type === 'collection') {
      const collectionPages = [];
      input.collectionPages.forEach((page) => {
        // accumulate the pages in this particular collection
        collectionPages.push(page.fileName);
        // add to files
        Object.assign(files, {
          [page.fileName]: {
            pageId: page.fileName,
            pagePath: page.path,
          },
        });
      });

      // add to collections
      Object.assign(collections, {
        [input.name]: {
          collectionId: input.name,
          pages: collectionPages,
        },
      });

      // add to collectionOrder
      collectionOrder.push(input.name);
    }
  });

  return {
    files,
    collections,
    collectionOrder,
  };
}

// first, use a function to get the data into an order that's easier to understand
console.log(dragAndDropData(testData));
// console.log(cleanedData);
export default cleanedData;
