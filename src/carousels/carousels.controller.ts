import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CarouselsService } from './carousels.service';
import { Role } from '../auth/role.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { ImageFileInterceptor } from '../commons/interceptors/image-file.interceptor';
import { AuthenticateRequestInterface } from '../commons/interfaces/authenticate-request.interface';
import { CreateCarouselDto, UpdateCarouselDto } from './dto/carousel.dto';
import { User } from 'src/entities/user.entity';
import { ValidateCarouselIdPipe } from './pipes/carousels.pipe';
import { ValidateCarouselSlugPipe } from './pipes/slug.pipe';
import { Multer } from 'multer';

@Controller('carousels')
export class CarouselsController {
  constructor(private readonly carouselsService: CarouselsService) {}

  @Role('admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(ImageFileInterceptor('file', 'carousels')) // Gestion de l'upload
  async create(
    @Request() req: AuthenticateRequestInterface,
    @UploadedFile() file: Multer.File,
    @Body() carousel: CreateCarouselDto,
  ) {
    const user: User = req.user;

    const imageUrl = `/uploads/carousels/${file.filename}`;

    const data = await this.carouselsService.create(carousel, user, imageUrl);

    return {
      success: true,
      error: false,
      message: 'Caroussel créé avec succès',
      data,
    };
  }

  @Role('admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id')
  @UseInterceptors(ImageFileInterceptor('file', 'carousels'))
  async update(
    @Param('id', ValidateCarouselIdPipe) id: number,
    @Request() req: AuthenticateRequestInterface,
    @UploadedFile() file: Multer.File,
    @Body() carousel: UpdateCarouselDto,
  ) {
    
    const user: User = req.user;

    let imageUrl: string;

    if (file) {
      imageUrl = `/uploads/carousels/${file.filename}`;
    }

    const data = await this.carouselsService.update(
      id,
      carousel,
      user,
      imageUrl,
    );

    return {
      success: true,
      error: false,
      message: 'Caroussel modifié avec succès',
      data,
    };
  }

  @Get()
  async getAll() {
    const data = await this.carouselsService.findAll();

    return {
      success: true,
      error: false,
      message: 'Liste des caroussels récupérée avec succès',
      data,
    };
  }

  @Get(':slug')
  async getOne(@Param('slug', ValidateCarouselSlugPipe) slug: string) {
    const data = await this.carouselsService.findOneBySlug(slug);

    return {
      success: true,
      error: false,
      message: 'Caroussel récupéré avec succès',
      data,
    };
  }

  @Role('admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async deleteOne(@Param('id', ValidateCarouselIdPipe) id: number) {
    const data = await this.carouselsService.deleteOneById(id);

    return {
      success: true,
      error: false,
      message: 'Caroussel supprimé avec succès',
      data,
    };
  }
}
