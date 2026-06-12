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
      example: ['Invalid id'],
    },
  },
};

const objectId = {
  type: 'string',
  pattern: '^[0-9a-fA-F]{24}$',
  example: '665f1b2c4f8a1c7d9e123456',
};

const cart = {
  type: 'object',
  properties: {
    id: objectId,
    userId: objectId,
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: objectId,
          quantity: { type: 'number', example: 2 },
          unitPrice: { type: 'number', example: 49.99 },
          subtotal: { type: 'number', example: 99.98 },
        },
      },
    },
    totalItems: { type: 'number', example: 2 },
    totalAmount: { type: 'number', example: 99.98 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Cart Service API',
    version: '1.0.0',
    description: 'Swagger documentation for shopping cart APIs.',
  },
  servers: [
    {
      url: 'http://localhost:3003/api/v1',
      description: 'Local cart service',
    },
  ],
  tags: [{ name: 'Cart', description: 'Authenticated shopping cart endpoints' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiError: errorResponse,
      Cart: cart,
      AddCartItemRequest: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: objectId,
          quantity: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      UpdateCartItemRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'integer', minimum: 1, example: 3 },
        },
      },
    },
  },
  paths: {
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get current user cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Cart' },
                  'Cart fetched successfully',
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
      delete: {
        tags: ['Cart'],
        summary: 'Clear current user cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart cleared successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Cart' },
                  'Cart cleared successfully',
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
    },
    '/cart/items': {
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AddCartItemRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Cart item added successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Cart' },
                  'Cart item added successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid request body',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/cart/items/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: 'Update a cart item quantity',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: objectId }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateCartItemRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Cart item updated successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Cart' },
                  'Cart item updated successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid request body or product id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove item from cart',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Cart item removed successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Cart' },
                  'Cart item removed successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid product id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
  },
};

export { swaggerSpec };
