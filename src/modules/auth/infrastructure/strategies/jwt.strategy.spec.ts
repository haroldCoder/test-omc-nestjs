import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUserModel: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUserModel = {
      findById: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getModelToken(UserDocument.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should successfully validate and return user without password', async () => {
      const mockUser = {
        _id: 'mock-user-id',
        email: 'admin@test.com',
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await strategy.validate({ sub: 'mock-user-id', email: 'admin@test.com' });

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('mock-user-id');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(
        strategy.validate({ sub: 'mock-user-id', email: 'admin@test.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
