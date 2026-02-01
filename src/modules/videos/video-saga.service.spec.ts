import { Test, TestingModule } from '@nestjs/testing';
import { VideoSagaService } from './video-saga.service';
import { RollbackManager } from '../../common/managers/rollback.manager';
import { getConnectionToken } from '@nestjs/mongoose';
import { VIDEO_REPOSITORY, STORAGE_SERVICE } from '../../common/constants/tokens';
import { USER_REPOSITORY } from '../users/users.module';
import { InternalServerErrorException } from '@nestjs/common';

const mockVideoRepository = {
  create: jest.fn(),
};

const mockUserRepository = {
  incrementUploadCount: jest.fn(),
};

const mockStorageService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockRollbackManager = {
  addUndoTask: jest.fn(),
  executeRollback: jest.fn(),
  clearTasks: jest.fn(),
};

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

const mockConnection = {
  startSession: jest.fn().mockResolvedValue(mockSession),
};

describe('VideoSagaService', () => {
  let service: VideoSagaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoSagaService,
        { provide: RollbackManager, useValue: mockRollbackManager },
        { provide: getConnectionToken(), useValue: mockConnection },
        { provide: VIDEO_REPOSITORY, useValue: mockVideoRepository },
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: STORAGE_SERVICE, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<VideoSagaService>(VideoSagaService);
    jest.clearAllMocks();
  });

  it('should execute successfully when all steps succeed', async () => {
    // Setup Mocks
    mockVideoRepository.create.mockResolvedValue({ _id: 'video123' });
    mockStorageService.uploadFile.mockResolvedValue('http://s3/video.mp4');
    mockUserRepository.incrementUploadCount.mockResolvedValue({ _id: 'user123', uploadCount: 1 });

    const createDto = { title: 'Test', genreId: 'g1', description: 'desc' };
    const file = { originalname: 'test.mp4', buffer: Buffer.from('data') } as any;

    const result = await service.processVideoUpload(createDto, file, 'user123');

    // Verification
    expect(mockConnection.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockRollbackManager.addUndoTask).toHaveBeenCalledTimes(2); // DB Rollback + File Rollback
    expect(mockVideoRepository.create).toHaveBeenCalled();
    expect(mockStorageService.uploadFile).toHaveBeenCalled();
    expect(mockUserRepository.incrementUploadCount).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(mockRollbackManager.clearTasks).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should rollback when Step C (User Update) fails', async () => {
    // Setup Mocks
    mockVideoRepository.create.mockResolvedValue({ _id: 'video123' });
    mockStorageService.uploadFile.mockResolvedValue('http://s3/video.mp4');
    mockUserRepository.incrementUploadCount.mockRejectedValue(new Error('User DB Error'));

    const createDto = { title: 'Test', genreId: 'g1', description: 'desc' };
    const file = { originalname: 'test.mp4', buffer: Buffer.from('data') } as any;

    await expect(service.processVideoUpload(createDto, file, 'user123'))
      .rejects.toThrow(InternalServerErrorException);

    // Verification
    expect(mockRollbackManager.executeRollback).toHaveBeenCalled();
    // Commit should NOT be called
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    // Ideally abortTransaction is called via the executeRollback, but since we mock executeRollback,
    // we verify that the service CALLED executeRollback.
  });
});
