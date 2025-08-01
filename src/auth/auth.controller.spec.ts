// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { User, UserRole, UserStatus } from '@prisma/client';

// describe('AuthController', () => {
//   let controller: AuthController;
//   let authService: jest.Mocked<AuthService>;

//   const mockUser: User = {
//     id: 1,
//     name: 'Test User',
//     username: 'testuser',
//     email: 'test@example.com',
//     password: 'hashed-password',
//     status: UserStatus.active,
//     role: UserRole.admin,
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             register: jest.fn(),
//             login: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//     authService = module.get(AuthService);
//   });

//   describe('register', () => {
//     it('should call authService.register and return result', async () => {
//       const dto = {
//         name: 'New User',
//         username: 'newuser',
//         email: 'new@example.com',
//         password: 'password123',
//         status: UserStatus.active,
//         role: UserRole.user,
//       };

//       const expected = { ...dto, id: 2 };
//       authService.register.mockResolvedValue(expected);

//       const result = await controller.register(dto);
//       expect(authService.register).toHaveBeenCalledWith(
//         dto.name,
//         dto.username,
//         dto.email,
//         dto.password,
//         dto.status,
//         dto.role,
//       );
//       expect(result).toEqual(expected);
//     });
//   });

//   describe('login', () => {
//     it('should return login result from authService', async () => {
//       const expectedToken = {
//         access_token: 'mocked-jwt-token',
//         user: {
//           id: mockUser.id,
//           name: mockUser.name,
//           email: mockUser.email,
//         },
//       };

//       authService.login.mockReturnValue(expectedToken);

//       const req = { user: mockUser };
//       const result = controller.login(req);

//       expect(authService.login).toHaveBeenCalledWith(mockUser);
//       expect(result).toEqual(expectedToken);
//     });
//   });

//   describe('getProfile', () => {
//     it('should return the current user profile', () => {
//       const req = { user: mockUser };
//       const result = controller.getProfile(req);
//       expect(result).toEqual(mockUser);
//     });
//   });
// });
