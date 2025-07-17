    /* eslint-disable prettier/prettier */
    import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { CreateCityDto } from "./dto/createcity.dto";
    import { City } from "@prisma/client";
    import { UpdateCityDto } from "./dto/updatecity.dto";

    @Injectable()
    export class CityService {
        constructor(private prisma:PrismaService){}

        async create(createCityDto:CreateCityDto):Promise<City>{
            try{
                const existingCityByName = await this.prisma.city.findUnique({where: { name: createCityDto.name },});
                if (existingCityByName) {
                    throw new ConflictException(`City with name "${createCityDto.name}" already exists.`);
                }
                const existingCityByCode = await this.prisma.city.findUnique({where: { code: createCityDto.code },});
                if (existingCityByCode) {
                    throw new ConflictException(`City with code "${createCityDto.code}" already exists.`);
                }
                const city = await this.prisma.city.create({
                    data: createCityDto,
                })
                return city;
            }
            catch(error){
                if(error instanceof ConflictException){
                    throw error;
                }
                console.error('Error creating city',error);
                throw new InternalServerErrorException('Failed to create city');
            }
        }

        async findAll(page?:number , limit?:number):Promise<{ data: City[]; total: number; page: number; totalPages: number }>{
            const skip = page && limit ? (page - 1) * limit : undefined;
            const take = limit;

            try {
                const [data, total] = await Promise.all([
                    this.prisma.city.findMany({
                        skip: skip,
                        take: take,
                        orderBy: {
                            name: 'asc',
                        },
                    }),
                    this.prisma.city.count(),
                ]);

                const totalPages = limit ? Math.ceil(total / limit) : 1;

                return {
                    data,
                    total,
                    page: page || 1,
                    totalPages,
                };
            } catch (error) {
                console.error('Error in CityService.findAll:', error);
                throw new InternalServerErrorException('Failed to retrieve cities.');
            }
        }

        async findOne(id:number):Promise<City>{
            const city = await this.prisma.city.findUnique({
                where: { id },
            })
            if(!city){
                throw new NotFoundException(`City with ID ${id} not found.`);
            }
            return city;
        }

        async update(id:number,UpdateCityDto:UpdateCityDto):Promise<City>{
            try{
                const existingCity = await this.prisma.city.findUnique({
                where: { id },
                });
                if (!existingCity) {
                    throw new NotFoundException(`City with ID ${id} not found.`);
                }
                if (UpdateCityDto.name && UpdateCityDto.name !== existingCity.name) {
                    const nameExists = await this.prisma.city.findUnique({
                        where: { name: UpdateCityDto.name },
                    });
                    if (nameExists && nameExists.id !== id) {
                        throw new ConflictException(`City with name "${UpdateCityDto.name}" already exists.`);
                    }
                }
                if (UpdateCityDto.code && UpdateCityDto.code !== existingCity.code) {
                    const codeExists = await this.prisma.city.findUnique({
                        where: { code: UpdateCityDto.code },
                    });
                    if (codeExists && codeExists.id !== id) {
                        throw new ConflictException(`City with code "${UpdateCityDto.code}" already exists.`);
                    }
                }
                const updatedCity = await this.prisma.city.update({
                    where: { id },
                    data: UpdateCityDto,
                });
                return updatedCity;
            }
            catch(error){
                if(error instanceof NotFoundException || error instanceof ConflictException){
                    throw error;
                }
                console.error(`Error updating city with ID ${id}:`, error);
                throw new InternalServerErrorException('Failed to update city.');
            }
        }

        async remove(id: number): Promise<void> {
        try {
          const existingCity = await this.prisma.city.findUnique({
            where: { id },
          });
          if (!existingCity) {
            throw new NotFoundException(`City with ID ${id} not found.`);
          }

          await this.prisma.city.delete({
            where: { id },
          });
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error;
          }
          console.error(`Error deleting city with ID ${id}:`, error);
          throw new InternalServerErrorException('Failed to delete city.');
        }
      }
    }
    