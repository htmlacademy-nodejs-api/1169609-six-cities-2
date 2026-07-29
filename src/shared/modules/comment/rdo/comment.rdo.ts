import { Expose, Transform, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt' })
  public postDate!: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user!: UserRdo;
}
