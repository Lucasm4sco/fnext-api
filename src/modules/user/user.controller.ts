import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { VerifyAccountDTO } from "src/dto/user/VerifyAccountDTO";
import { EConfirmationCodeStatus } from "src/enums/operationsResults/EConfirmationCodeStatus";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("verify")
  @HttpCode(200)
  async register(@Body() verifyAccountDto: VerifyAccountDTO) {
    const result = await this.userService.confirmAccount(verifyAccountDto);

    if (result === EConfirmationCodeStatus.INCORRECT) {
      throw new HttpException("Codigo Incorreto", HttpStatus.CONFLICT);
    }

    if (result === EConfirmationCodeStatus.ALREADY_ACTIVE) {
      throw new HttpException("Conta ja Ativada", HttpStatus.CONFLICT);
    }

    if (result === EConfirmationCodeStatus.NOT_FOUND) {
      throw new HttpException("Usuario nao encontrado", HttpStatus.NOT_FOUND);
    }

    if (result === EConfirmationCodeStatus.OVERDUE) {
      throw new HttpException(
        "Codigo vencido, gere outro",
        HttpStatus.CONFLICT
      );
    }

    if (result === EConfirmationCodeStatus.CORRECT) {
      return;
    }
  }
}
