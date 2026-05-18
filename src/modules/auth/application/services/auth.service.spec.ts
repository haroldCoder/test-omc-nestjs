import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from '../../infrastructure/schemas/user.schema';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
    };

    // Mapeamos el constructor de Mongoose new this.userModel()
    const mockUserModelConstructor = jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'mock-user-id',
      save: jest.fn().mockResolvedValue(true),
    }));
    Object.assign(mockUserModelConstructor, mockUserModel);

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(UserDocument.name),
          useValue: mockUserModelConstructor,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user with hashed password', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.register({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(result).toEqual({
        message: 'Usuario registrado exitosamente.',
        userId: 'mock-user-id',
      });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'admin@test.com' });
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'admin@test.com' }),
      });

      await expect(
        service.register({
          name: 'Test Admin',
          email: 'admin@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login and return a signed JWT', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'mock-user-id',
          email: 'admin@test.com',
          password: hashedPassword,
        }),
      });

      const result = await service.login({
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'mock-user-id',
        email: 'admin@test.com',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.login({
          email: 'admin@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'mock-user-id',
          email: 'admin@test.com',
          password: hashedPassword,
        }),
      });

      await expect(
        service.login({
          email: 'admin@test.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
