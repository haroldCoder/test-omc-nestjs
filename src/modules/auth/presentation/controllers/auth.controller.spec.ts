import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockResolvedValue({
        message: 'Usuario registrado exitosamente.',
        userId: 'mock-user-id',
      }),
      login: jest.fn().mockResolvedValue({
        accessToken: 'mock-jwt-token',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the user registration details', async () => {
      const registerDto = {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
      };

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        message: 'Usuario registrado exitosamente.',
        userId: 'mock-user-id',
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login and return an access token', async () => {
      const loginDto = {
        email: 'admin@test.com',
        password: 'password123',
      };

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
