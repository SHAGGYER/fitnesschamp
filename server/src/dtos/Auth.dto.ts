import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "This field is required" })
  name: string;

  @IsString()
  @IsEmail({}, { message: "Must be an email" })
  @IsNotEmpty({ message: "This field is required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "This field is required" })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "This field is required" })
  passwordConfirmation: string;
}
