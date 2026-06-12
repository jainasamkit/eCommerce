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
      example: ['productId is required'],
    },
  },
};

const product = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '665f1b2c4f8a1c7d9e123456' },
    name: { type: 'string', example: 'Wireless Headphones' },
    description: { type: 'string', example: 'Noise cancelling over-ear headphones' },
    quantity: { type: 'number', example: 25 },
    brand: { type: 'string', nullable: true, example: 'Acme' },
    price: { type: 'number', example: 129.99 },
    images: {
      type: 'array',
      items: { type: 'string', format: 'uri' },
      example: ['https://cdn.example.com/products/headphones.jpg'],
    },
    category: {
      type: 'array',
      items: { type: 'string' },
      example: ['electronics', 'audio'],
    },
    discount: { type: 'number', nullable: true, example: 10 },
    specifications: {
      type: 'object',
      additionalProperties: {
        oneOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'array', items: { type: 'string' } },
        ],
      },
      example: { color: 'black', wireless: true },
    },
    createdBy: { type: 'string', nullable: true, example: '665f1b2c4f8a1c7d9e654321' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Product Service API',
    version: '1.0.0',
    description: 'Swagger documentation for product catalog APIs.',
  },
  servers: [
    {
      url: 'http://localhost:3001/api/v1',
      description: 'Local product service',
    },
  ],
  tags: [{ name: 'Products', description: 'Product catalog endpoints' }],
  components: {
    schemas: {
      ApiError: errorResponse,
      Product: product,
      ProductListResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 42 },
              totalPages: { type: 'number', example: 5 },
            },
          },
        },
      },
    },
  },
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'brand',
            in: 'query',
            description: 'Comma-separated brand filters',
            schema: { type: 'string', example: 'Acme,Sony' },
          },
          {
            name: 'category',
            in: 'query',
            description: 'Comma-separated category filters',
            schema: { type: 'string', example: 'electronics,audio' },
          },
          {
            name: 'specifications',
            in: 'query',
            description: 'Comma-separated key:value filters',
            schema: { type: 'string', example: 'color:black,wireless:true' },
          },
          { name: 'specificationKey', in: 'query', schema: { type: 'string', example: 'color' } },
          {
            name: 'specificationValue',
            in: 'query',
            schema: { type: 'string', example: 'black' },
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['createdAt', 'price', 'name'], default: 'createdAt' },
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
        ],
        responses: {
          200: {
            description: 'Products fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/ProductListResponse' },
                  'Products fetched successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid query parameters',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
    '/products/{productId}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by id',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string', example: '665f1b2c4f8a1c7d9e123456' },
          },
        ],
        responses: {
          200: {
            description: 'Product fetched successfully',
            content: {
              'application/json': {
                schema: apiResponse(
                  { $ref: '#/components/schemas/Product' },
                  'Product fetched successfully',
                ),
              },
            },
          },
          400: {
            description: 'Invalid product id',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
          404: {
            description: 'Product not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
          },
        },
      },
    },
  },
};

export { swaggerSpec };
