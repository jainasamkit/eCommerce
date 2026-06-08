const apiResponse = (dataSchema: Record<string, unknown> | null, message: string) => ({
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 200 },
    data: dataSchema ?? { nullable: true, example: null },
    message: { type: 'string', example: message },
    success: { type: 'boolean', example: true },
  },
});

const errorResponse = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 400 },
    data: { nullable: true, example: null },
    message: { type: 'string', example: 'Validation failed' },
    success: { type: 'boolean', example: false },
    errors: {
      type: 'array',
      items: { type: 'string' },
      example: ['Email is required'],
    },
  },
};

const userProfile = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '665f1b2c4f8a1c7d9e123456' },
    name: { type: 'string', example: 'John Doe' },
    email: { type: 'string', format: 'email', example: 'user@example.com' },
    role: { type: 'string', example: 'USER' },
    profilePic: {
      type: 'string',
      nullable: true,
      example: 'https://cdn.example.com/users/profile-pics/profile.jpg',
    },
  },
};

const tokenPair = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access',
    },
    refreshToken: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh',
    },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'User Service API',
    version: '1.0.0',
    description: 'Swagger documentation for authentication and user profile APIs.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local user service',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User authentication and profile endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: errorResponse,
      UserProfile: userProfile,
      TokenPair: tokenPair,
      RegisterUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password@123',
          },
        },
      },
      RegisterUserMultipartRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password@123',
          },
          profilePic: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      LoginUserRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', format: 'password', example: 'Password@123' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh',
          },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: { type: 'string', example: 'reset-token-from-email' },
          newPassword: { type: 'string', format: 'password', example: 'NewPassword@123' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: {
            type: 'string',
            format: 'password',
            example: 'Password@123',
          },
          newPassword: {
            type: 'string',
            format: 'password',
            example: 'NewPassword@123',
          },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, example: 'John Doe' },
        },
      },
      UpdateProfileMultipartRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, example: 'John Doe' },
          profilePic: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  },
  paths: {
    '/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterUserRequest' },
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/RegisterUserMultipartRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/UserProfile' },
                  'User registered successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid request body',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginUserRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'User logged in successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/TokenPair' },
                  'User logged in successfully',
                ),
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/users/refresh-token': {
      post: {
        tags: ['Users'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/TokenPair' },
                  'Token refreshed successfully',
                ),
              },
            },
          },
        },
      },
    },
    '/users/forgot-password': {
      post: {
        tags: ['Users'],
        summary: 'Request password reset instructions',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Reset instructions generated if the email exists',
            content: {
              'application/json': {
                schema: apiResponse(
                  {
                    type: 'object',
                    properties: {
                      resetUrl: {
                        type: 'string',
                        example: 'http://localhost:3000/reset-password?token=reset-token',
                      },
                    },
                  },
                  'If the email exists, reset instructions were generated',
                ),
              },
            },
          },
        },
      },
    },
    '/users/reset-password': {
      post: {
        tags: ['Users'],
        summary: 'Reset password using a reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: apiResponse(null, 'Password reset successfully'),
              },
            },
          },
        },
      },
    },
    '/users/logout': {
      post: {
        tags: ['Users'],
        summary: 'Logout current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User logged out successfully',
            content: {
              'application/json': {
                schema: apiResponse(null, 'User logged out successfully'),
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/users/change-password': {
      post: {
        tags: ['Users'],
        summary: 'Change password for current user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
            content: {
              'application/json': {
                schema: apiResponse(null, 'Password changed successfully'),
              },
            },
          },
        },
      },
    },
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/UserProfile' },
                  'Profile fetched successfully',
                ),
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            },
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/UpdateProfileMultipartRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/UserProfile' },
                  'Profile updated successfully',
                ),
              },
            },
          },
        },
      },
    },
  },
};

export { swaggerSpec };
