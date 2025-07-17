/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { CityController } from "./city.controller";
import { CityService } from "./city.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    controllers:[CityController],
    providers:[CityService],
    imports:[PrismaModule],
    exports:[CityService],
})
export class CityModule{}