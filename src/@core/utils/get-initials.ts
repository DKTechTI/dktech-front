// ** Returns initials from string
export const getInitials = (string: string) =>
  string
    .split(/\s/)
    .splice(0, 2)
    .reduce((response, word) => (response += word.slice(0, 1)), '')
