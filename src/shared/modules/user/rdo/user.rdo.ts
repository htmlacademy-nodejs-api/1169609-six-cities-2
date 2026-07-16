import { Expose, Transform } from 'class-transformer';

export class UserRdo {
    @Expose({ name: 'id' })
    @Transform(({ obj }) => obj._id.toString())
  public id!: string;

    @Expose()
    public email!: string;
}
