import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  const pepper = getPepper();
  const spicyPassword = password + pepper;
  const hashedPassword = await bcryptjs.hash(spicyPassword, rounds);
  return hashedPassword;
}

async function compare(providedPassword, storedPassword) {
  const pepper = getPepper();
  const spicyPassword = providedPassword + pepper;

  return await bcryptjs.compare(spicyPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 4;
}

function getPepper() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.PEPPER) {
      throw new Error(
        "Environment variable PEPPER it's not defined in production!",
      );
    }
    return process.env.PEPPER;
  }
  return "REDHOTCHILIPEPPER";
}

const password = {
  hash,
  compare,
};

export default password;
