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

const address = {
  type: 'object',
  properties: {
    id: objectId,
    userId: objectId,
    fullName: { type: 'string', example: 'John Doe' },
    phoneNumber: { type: 'string', example: '+15551234567' },
    addressLine1: { type: 'string', example: '123 Main Street' },
    addressLine2: { type: 'string', nullable: true, example: 'Apartment 4B' },
    city: { type: 'string', example: 'New York' },
    state: { type: 'string', example: 'NY' },
    postalCode: { type: 'string', example: '10001' },
    country: { type: 'string', example: 'USA' },
    landmark: { type: 'string', nullable: true, example: 'Near Central Park' },
    addressType: { type: 'string', nullable: true, example: 'home' },
    isDefault: { type: 'boolean', example: true },
    isDeleted: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const order = {
  type: 'object',
  properties: {
    id: objectId,
    userId: objectId,
    productId: objectId,
    addressId: objectId,
    quantity: { type: 'number', example: 2 },
    unitPrice: { type: 'number', example: 49.99 },
    subtotal: { type: 'number', example: 99.98 },
    shippingFee: { type: 'number', example: 0 },
    tax: { type: 'number', example: 0 },
    totalAmount: { type: 'number', example: 99.98 },
    status: {
      type: 'string',
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      example: 'pending',
    },
    paymentStatus: {
      type: 'string',
      enum: ['pending', 'paid', 'failed', 'refunded'],
      example: 'pending',
    },
    paymentMethod: { type: 'string', nullable: true, example: 'cod' },
    notes: { type: 'string', nullable: true, example: 'Leave at the front desk' },
    placedAt: { type: 'string', format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const createAddressRequest = {
  type: 'object',
  required: ['fullName', 'phoneNumber', 'addressLine1', 'city', 'state', 'postalCode', 'country'],
  properties: {
    fullName: { type: 'string', minLength: 2, example: 'John Doe' },
    phoneNumber: { type: 'string', minLength: 6, example: '+15551234567' },
    addressLine1: { type: 'string', minLength: 3, example: '123 Main Street' },
    addressLine2: { type: 'string', example: 'Apartment 4B' },
    city: { type: 'string', minLength: 2, example: 'New York' },
    state: { type: 'string', minLength: 2, example: 'NY' },
    postalCode: { type: 'string', minLength: 3, example: '10001' },
    country: { type: 'string', minLength: 2, example: 'USA' },
    landmark: { type: 'string', example: 'Near Central Park' },
    addressType: { type: 'string', example: 'home' },
    isDefault: { type: 'boolean', example: true },
  },
};

const updateAddressRequest = {
  type: 'object',
  properties: createAddressRequest.properties,
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Order Service API',
    version: '1.0.0',
    description: 'Swagger documentation for order and address APIs.',
  },
  servers: [
    {
      url: 'http://localhost:3002/api/v1',
      description: 'Local order service',
    },
  ],
  tags: [
    { name: 'Orders', description: 'Authenticated order endpoints' },
    { name: 'Addresses', description: 'Authenticated shipping address endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiError: errorResponse,
      Order: order,
      Address: address,
      PlaceOrderRequest: {
        type: 'object',
        required: ['productId', 'addressId', 'quantity'],
        properties: {
          productId: objectId,
          addressId: objectId,
          quantity: { type: 'integer', minimum: 1, example: 2 },
          paymentMethod: { type: 'string', example: 'cod' },
          notes: { type: 'string', example: 'Leave at the front desk' },
        },
      },
      CreateAddressRequest: createAddressRequest,
      UpdateAddressRequest: updateAddressRequest,
      PublishOrderCreatedTestResponse: {
        type: 'object',
        properties: {
          eventId: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid' },
          productId: { type: 'string', example: 'test-product-id' },
          quantity: { type: 'number', example: 1 },
        },
      },
      DeleteAddressResponse: {
        type: 'object',
        properties: {
          deleted: { type: 'boolean', example: true },
          id: objectId,
        },
      },
    },
  },
  paths: {
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place an order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PlaceOrderRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Order placed successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Order' },
                  'Order placed successfully',
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
      get: {
        tags: ['Orders'],
        summary: 'Get current user orders',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Orders fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                  'Orders fetched successfully',
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
    '/orders/publish-test': {
      post: {
        tags: ['Orders'],
        summary: 'Publish a test order.created event',
        security: [{ bearerAuth: [] }],
        responses: {
          202: {
            description: 'Test order.created event published successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/PublishOrderCreatedTestResponse' },
                  'Test order.created event published successfully',
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
    '/orders/{orderId}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Order fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Order' },
                  'Order fetched successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid order id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/orders/{orderId}/cancel': {
      patch: {
        tags: ['Orders'],
        summary: 'Cancel order by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Order cancelled successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Order' },
                  'Order cancelled successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid order id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/addresses': {
      post: {
        tags: ['Addresses'],
        summary: 'Create an address',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateAddressRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Address created successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Address' },
                  'Address created successfully',
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
      get: {
        tags: ['Addresses'],
        summary: 'List current user addresses',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Addresses fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { type: 'array', items: { $ref: '#/components/schemas/Address' } },
                  'Addresses fetched successfully',
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
    '/addresses/{addressId}': {
      get: {
        tags: ['Addresses'],
        summary: 'Get address by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'addressId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Address fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Address' },
                  'Address fetched successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid address id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      patch: {
        tags: ['Addresses'],
        summary: 'Update address by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'addressId', in: 'path', required: true, schema: objectId }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateAddressRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Address updated successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Address' },
                  'Address updated successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid request body or address id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
      delete: {
        tags: ['Addresses'],
        summary: 'Delete address by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'addressId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Address deleted successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/DeleteAddressResponse' },
                  'Address deleted successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid address id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/addresses/{addressId}/default': {
      patch: {
        tags: ['Addresses'],
        summary: 'Set address as default',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'addressId', in: 'path', required: true, schema: objectId }],
        responses: {
          200: {
            description: 'Default address updated successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Address' },
                  'Default address updated successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid address id',
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
