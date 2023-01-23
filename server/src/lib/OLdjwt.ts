import { sign } from "jsonwebtoken";

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(user) {
  return sign({}, process.env.JWT_ACCESS_SECRET, {
    subject: user.id,
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

export function generateTokens(user) {
  const accessToken = generateAccessToken(user);

  return {
    bearer: accessToken,
  };
}
