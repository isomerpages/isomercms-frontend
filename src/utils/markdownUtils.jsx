/* eslint-disable no-underscore-dangle */
/**
 * The getState and _replaceSelection functions are needed to help
 * us insert the necessary filepaths to our text editor.
 *
 * These functions were taken from the SimpleMDE repo at this link:
 * https://github.com/sparksuite/simplemde-markdown-editor/blob/
 * 6abda7ab68cc20f4aca870eb243747951b90ab04/src/js/simplemde.js
 */

export function getState(cm, posn) {
  const pos = posn || cm.getCursor('start');
  const stat = cm.getTokenAt(pos);
  if (!stat.type) return {};

  const types = stat.type.split(' ');

  const ret = {};
  let data; let
    text;
  for (let i = 0; i < types.length; i += 1) {
    data = types[i];
    if (data === 'strong') {
      ret.bold = true;
    } else if (data === 'variable-2') {
      text = cm.getLine(pos.line);
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ordered-list'] = true;
      } else {
        ret['unordered-list'] = true;
      }
    } else if (data === 'atom') {
      ret.quote = true;
    } else if (data === 'em') {
      ret.italic = true;
    } else if (data === 'quote') {
      ret.quote = true;
    } else if (data === 'strikethrough') {
      ret.strikethrough = true;
    } else if (data === 'comment') {
      ret.code = true;
    } else if (data === 'link') {
      ret.link = true;
    } else if (data === 'tag') {
      ret.image = true;
    } else if (data.match(/^header(\-[1-6])?$/)) {
      ret[data.replace('header', 'heading')] = true;
    }
  }
  return ret;
}

export function _replaceSelection(cm, active, startEnd, url) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className)) { return; }

  let text;
  let start = startEnd[0];
  let end = startEnd[1];
  const startPoint = cm.getCursor('start');
  const endPoint = cm.getCursor('end');
  if (url) {
    end = end.replace('#url#', url);
  }
  if (active) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0,
    });
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;
    if (startPoint !== endPoint) {
      endPoint.ch += start.length;
    }
  }
  cm.setSelection(startPoint, endPoint);
  cm.focus();
}
