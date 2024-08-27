import {tokenManager} from "../classes/token-manager"
import {userManager} from "../classes/user-manager"

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = tokenManager.verifyRefreshToken(refreshToken);

  if (!decoded) return res.status(401).json({ message: 'Invalid refresh token' });

  const correctUser = (await userManager.checkUser("id",decoded.userId)).success;

  if(!correctUser) return res.status(401).json({ message: 'Invalid refresh token' });

  const newAccessToken = tokenManager.signMainToken({ userId: decoded.userId });
  const newRefreshToken = tokenManager.signRefreshToken({ userId: decoded.userId });

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};