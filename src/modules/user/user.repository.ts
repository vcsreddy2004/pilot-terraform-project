// user.repository.ts
import User from "../../models/user.model";
export const findUserByEmail = async (email: string,attributes?: string[]) => {
  return User.findOne({
    where: { email },
    attributes,
  });
};