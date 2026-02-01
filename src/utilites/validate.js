exports.validateUser = (user) => {
  if (
    !user.name ||
    !user.email ||
    !user.mobileNumber ||
    !user.password ||
    !user.membershipType
  ) {
    return false;
  }
  return true;
};
