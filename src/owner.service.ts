import { HttpCode, Injectable } from "@nestjs/common";
import { createOwnerDTO } from "./dto/createOwnerDTO";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class OwnerService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async register(dto: createOwnerDTO) {
    try {
      const result = await this.prismaClient.owner.create({
        data: {
          name: dto.name,
          email: dto.email,
          birth_date: `${dto.birthdate}T00:00:00.000Z`,
        },
      });
      await this.prismaClient.$disconnect();
      return result;
    } catch (exception) {
      if (exception.code === "P2002") {
        await this.prismaClient.$disconnect();
        return false;
      }
    }
  }
}
