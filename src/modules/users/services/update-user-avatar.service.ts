import { Inject, Injectable } from '@nestjs/common';
import { AppError } from 'src/modules/shared/errors/AppError';
import { IStorageProvider } from 'src/modules/shared/providers/StorageProvider/models/storage.provider';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@Injectable()
export class UpdateUserAvatarService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}
