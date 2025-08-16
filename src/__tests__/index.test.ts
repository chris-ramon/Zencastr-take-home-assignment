import request from 'supertest';
import app from '../index';

describe('Express App', () => {

  describe('GET /ping', () => {
    it('should return OK', async () => {
      const response = await request(app)
        .get('/ping')
        .expect(200);
      
      expect(response.text).toBe('OK');
    });
  });

  describe('POST /cache/add', () => {
    it('should add an item to the cache successfully', async () => {
      const key = 'testKey';
      const value = 'testValue';
      
      const response = await request(app)
        .post('/cache/add')
        .send({ key, value })
        .expect(201);
      
      expect(response.body).toEqual({ key, value });
    });

    it('should return 400 when key is missing', async () => {
      const response = await request(app)
        .post('/cache/add')
        .send({ value: 'testValue' })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key and value (both strings) are required' });
    });

    it('should return 400 when value is missing', async () => {
      const response = await request(app)
        .post('/cache/add')
        .send({ key: 'testKey' })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key and value (both strings) are required' });
    });

    it('should return 400 when key is not a string', async () => {
      const response = await request(app)
        .post('/cache/add')
        .send({ key: 123, value: 'testValue' })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key and value (both strings) are required' });
    });

    it('should return 400 when value is not a string', async () => {
      const response = await request(app)
        .post('/cache/add')
        .send({ key: 'testKey', value: 123 })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key and value (both strings) are required' });
    });

    it('should return 400 when body is empty', async () => {
      const response = await request(app)
        .post('/cache/add')
        .send({})
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key and value (both strings) are required' });
    });
  });

  describe('GET /cache/get', () => {
    it('should return the value for an existing key', async () => {
      const key = 'testKey';
      const value = 'testValue';
      
      // First add the item
      await request(app)
        .post('/cache/add')
        .send({ key, value })
        .expect(201);
      
      // Then get it
      const response = await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      expect(response.text).toBe(value);
    });

    it('should return undefined for a non-existing key', async () => {
      const key = 'nonExistingKey';
      
      const response = await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      expect(response.text).toBe('');
    });

    it('should return 400 when key is missing', async () => {
      const response = await request(app)
        .get('/cache/get')
        .send({})
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key (string) is required' });
    });

    it('should return 400 when key is not a string', async () => {
      const response = await request(app)
        .get('/cache/get')
        .send({ key: 123 })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key (string) is required' });
    });
  });

  describe('POST /cache/remove', () => {
    it('should remove an item from the cache successfully', async () => {
      const key = 'testKey';
      const value = 'testValue';
      
      // First add the item
      await request(app)
        .post('/cache/add')
        .send({ key, value })
        .expect(201);
      
      // Verify it exists
      await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      // Remove it
      const response = await request(app)
        .post('/cache/remove')
        .send({ key })
        .expect(200);
      
      expect(response.text).toBe('');
      
      // Verify it's gone
      const getResponse = await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      expect(getResponse.text).toBe('');
    });

    it('should return 400 when key is missing', async () => {
      const response = await request(app)
        .post('/cache/remove')
        .send({})
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key (string) is required' });
    });

    it('should return 400 when key is not a string', async () => {
      const response = await request(app)
        .post('/cache/remove')
        .send({ key: 123 })
        .expect(400);
      
      expect(response.body).toEqual({ error: 'key (string) is required' });
    });
  });

  describe('Integration tests', () => {
    it('should handle a complete add-get-remove cycle', async () => {
      const key = 'integrationKey';
      const value = 'integrationValue';
      
      // Add item
      const addResponse = await request(app)
        .post('/cache/add')
        .send({ key, value })
        .expect(201);
      
      expect(addResponse.body).toEqual({ key, value });
      
      // Get item
      const getResponse = await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      expect(getResponse.text).toBe(value);
      
      // Remove item
      await request(app)
        .post('/cache/remove')
        .send({ key })
        .expect(200);
      
      // Verify item is gone
      const getAfterRemoveResponse = await request(app)
        .get('/cache/get')
        .send({ key })
        .expect(200);
      
      expect(getAfterRemoveResponse.text).toBe('');
    });
  });
});
