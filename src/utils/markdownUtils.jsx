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
  toggleCodeBlock,
  toggleBlockquote,
  toggleUnorderedList,
  toggleOrderedList,
  drawLink,
  drawImage,
  drawTable,
} from 'easymde';

export const easyMdeToolbar = [
  {
    name: 'bold',
    action: toggleBold,
    className: 'fa fa-bold',
    title: 'Bold',
  },
  {
    name: 'italic',
    action: toggleItalic,
    className: 'fa fa-italic',
    title: 'Italic',
    default: true,
  },
  {
    name: 'strikethrough',
    action: toggleStrikethrough,
    className: 'fa fa-strikethrough',
    title: 'Strikethrough',
  },
  {
    name: 'heading',
    action: toggleHeadingSmaller,
    className: 'fa fa-header',
    title: 'Heading',
    default: true,
  },
  '|',
  {
    name: 'code',
    action: toggleCodeBlock,
    className: 'fa fa-code',
    title: 'Code',
  },
  {
    name: 'quote',
    action: toggleBlockquote,
    className: 'fa fa-quote-left',
    title: 'Quote',
    default: true,
  },
  {
    name: 'unordered-list',
    action: toggleUnorderedList,
    className: 'fa fa-list-ul',
    title: 'Generic List',
    default: true,
  },
  {
    name: 'ordered-list',
    action: toggleOrderedList,
    className: 'fa fa-list-ol',
    title: 'Numbered List',
    default: true,
  },
  '|',
  {
    name: 'link',
    action: drawLink,
    className: 'fa fa-link',
    title: 'Create Link',
    default: true,
  },
  {
    name: 'image',
    action: drawImage,
    className: 'fa fa-picture-o',
    title: 'Insert Image',
    default: true,
  },
  {
    name: 'table',
    action: drawTable,
    className: 'fa fa-table',
    title: 'Insert Table',
  },
  '|',
  {
    name: 'guide',
    action: 'https://simplemde.com/markdown-guide',
    className: 'fa fa-question-circle',
    title: 'Markdown Guide',
    default: true,
  },
];
