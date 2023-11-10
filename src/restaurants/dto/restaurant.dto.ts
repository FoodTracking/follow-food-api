import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class RestaurantDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => obj?.category?.name)
  category: string;

  @Expose()
  address: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.identity.avatar
      ? `${process.env.API_BASE_URL}/public/${obj.identity.avatar}`
      : undefined,
  )
  image: string;
}
