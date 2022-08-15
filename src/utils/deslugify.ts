import _ from "lodash"

// this function deslugifies a string into readable form
// for example, 'this-is-a-directory' -> 'This Is A Directory'
const deslugify = (s: string): string => {
  return s
    .split("-")
    .map((word) => _.upperFirst(word)) // capitalize first letter
    .join(" ") // join it back together
}

// this function converts directories into readable form
// for example, 'this-is-a-directory' -> 'This Is A Directory'
export const deslugifyDirectory = deslugify

// this function converts file names into readable form
// for example, 'this-is-a-file.md' -> 'This Is A File'
export const deslugifyPage = (pageName: string): string =>
  deslugify(pageName.split(".")[0]) // remove the file extension
