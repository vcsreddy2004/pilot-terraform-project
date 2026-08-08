import User from "../../models/user.model";
import Otp from "../../models/otp.model";
import { OTPResponseDTO,CreateRefreshTokenDTO, UpdatePaswordDTO } from "./auth.dto";
import { CreateUserDTO } from "./auth.validation";
import RefreshToken from "../../models/refreshToken.model";
class AuthRepository {
  markOTPAsUsed = async (email: string) => {
    return await Otp.update(
      { isUsed: true },        
      { where: { email } }     
    );
  };
  createOTP = async (data:OTPResponseDTO) => {
    return await Otp.create(data);
  }
  deleteOTPByEmail = async(email:string) => {
    return await Otp.destroy({where:{email}});
  }
  findOTPByEmail = async(email:string,attributes?: string[]) => {
    return await Otp.findOne({where: {email},attributes});
  }
  findUserByEmail = async (email: string,attributes?: string[]) => {
    return User.findOne({
      where: { email },
      attributes,
    });
  };
  createUser = async (data: CreateUserDTO) => {
    return await User.create(data);
  };
  updateTokenVersionByEmail = async (email:string) => {
    return await await User.increment("tokenVersion", {by: 1,where: { email }});
  }
  markUserAsVerified = async (email:string) => {
    return await User.update(
      {isVerified:true},
      {where:{email}}
    )
  }
  updateUserPassword = async (data:UpdatePaswordDTO) => {
    return await User.update({password:data.password},{where:{email:data.email}});
  }
  createRefreshToken = async (data:CreateRefreshTokenDTO) => {
    return await RefreshToken.create(data);
  }
  findRefreshTokenByToken = async (token:string,attributes:string[]) => {
    return RefreshToken.findOne({
      where: { token },
      attributes,
    });
  }
  deleteRefreshToken = async (email:string) => {
    return await RefreshToken.destroy({where:{email}});
  }
}
export default new AuthRepository;