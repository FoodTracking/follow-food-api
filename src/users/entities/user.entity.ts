import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/enum/user-role.dto';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'role', enum: Role, default: Role.USER })
  role: Role;
}
