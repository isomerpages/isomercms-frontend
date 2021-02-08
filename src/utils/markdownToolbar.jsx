/* eslint-disable import/prefer-default-export */
/** *
 * This file exposes and exports default actions from the EasyMDE library
 * and includes a new default image upload action
 *
 * Note that some of the code is taken directly from the SimpleMDE library
 * (https://github.com/sparksuite/simplemde-markdown-editor/blob/6abda7ab6
 * 8cc20f4aca870eb243747951b90ab04/src/js/simplemde.js) since EasyMDE is a
 * fork of SimpleMDE
*/

import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleHeadingSmaller,
  toggleHeadingBigger,
  toggleCodeBlock,
  toggleBlockquote,
  toggleUnorderedList,
  toggleOrderedList,
  drawLink,
  drawTable,
} from 'easymde';

export const boldButton = {
  name: 'bold',
  action: toggleBold,
  className: 'fa fa-bold',
  title: 'Bold',
};

export const italicButton = {
  name: 'italic',
  action: toggleItalic,
  className: 'fa fa-italic',
  title: 'Italic',
  default: true,
};

export const strikethroughButton = {
  name: 'strikethrough',
  action: toggleStrikethrough,
  className: 'fa fa-strikethrough',
  title: 'Strikethrough',
};

export const headingSmallerButton = {
  name: 'headingSmaller',
  action: toggleHeadingSmaller,
  className: 'fa fa-header',
  title: 'Decrease header size',
};

export const headingBiggerButton = {
  name: 'headingBigger',
  action: toggleHeadingBigger,
  className: 'fa fa-lg fa-header',
  title: 'Increase header size',
};

export const codeButton = {
  name: 'code',
  action: toggleCodeBlock,
  className: 'fa fa-code',
  title: 'Code',
};

export const quoteButton = {
  name: 'quote',
  action: toggleBlockquote,
  className: 'fa fa-quote-left',
  title: 'Quote',
  default: true,
};

export const unorderedListButton = {
  name: 'unordered-list',
  action: toggleUnorderedList,
  className: 'fa fa-list-ul',
  title: 'Generic List',
  default: true,
};

export const orderedListButton = {
  name: 'ordered-list',
  action: toggleOrderedList,
  className: 'fa fa-list-ol',
  title: 'Numbered List',
  default: true,
};

export const tableButton = {
  name: 'table',
  action: drawTable,
  className: 'fa fa-table',
  title: 'Insert Table',
};

export const guideButton = {
  name: 'guide',
  action: 'https://simplemde.com/markdown-guide',
  className: 'fa fa-question-circle',
  title: 'Markdown Guide',
  default: true,
};
