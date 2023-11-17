import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.identity.avatar
      ? `${process.env.API_BASE_URL}/public/${obj.identity.avatar}`
      : undefined,
  )
  avatar: string;

  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName[0]}.`)
  name: string;
}
