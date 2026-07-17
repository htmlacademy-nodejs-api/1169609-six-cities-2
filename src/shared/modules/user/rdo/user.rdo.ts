import { Expose, Transform } from 'class-transformer';

export class UserRdo {
    @Expose({ name: 'id' })
    @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  public id!: string;

    @Expose()
    public email!: string;
}
