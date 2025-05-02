export const getAvatarInitials = (nameOrEmail: string | undefined | null) => {
  if (!nameOrEmail) return "Me";

  if (nameOrEmail.includes("@")) {
    const emailParts = nameOrEmail.split("@");
    const nameParts = emailParts[0].split(".");
    if (nameParts.length > 1) {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
    return emailParts[0].charAt(0).toUpperCase();
  }
  // If the input is a name, split it by spaces and take the first and last initials
  const names = nameOrEmail.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};
