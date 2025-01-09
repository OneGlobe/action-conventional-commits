const isValidCommitMessage = (message: string, availableTypes: string[] = []): boolean => {
  let availableTypesString = availableTypes.join("|");
  let pattern = new RegExp(
    `^(?:${availableTypesString})` + // type
      `(?:\\([a-z0-9-]+\\))?` + // optional scope
      `(?:!)?` + // optional breaking change indicator
      `: ` + // required colon and space
      `.+` + // required subject (at least one character)
      `(?:\n\n[\\s\\S]*)?$` // optional body/footer (any content after double newline)
  );

  let match = message.match(pattern);

  return !!match;
};

export default isValidCommitMessage;
