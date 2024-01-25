const request = require('supertest');
const winston = require('winston');
const {Genre} = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(()=>{server = require('../../index');});
    afterEach(async ()=>{
        server.close();
        await Genre.deleteMany({});
    });
    
    describe('get /', () => {
        it('should return all genres', async () => {
            
            await Genre.collection.insertMany([
                {"name":"Genre1"},
                {"name":"Genre2 "}
            ]);
            const res = await request(server).get('/api/genres');
            //winston.info(`Response: ${JSON.stringify(res.body)}`);
            expect(res.statusCode).toBe(200);
            expect(Object.keys(res.body).length).toBe(2); 
            expect(res.body.some(g => g.name === "Genre1")).toBeTruthy();
            
        });

        it('should return a specific genre', async () => {
            
            const genre = await Genre.collection.insertOne(
                {"name":"Genre99"}
            );
            
            //winston.info(`ID: ${genre.insertedId}`);
            const res = await request(server).get('/api/genres/'+ genre.insertedId);
            
            expect(res.statusCode).toBe(200);
            expect(Object.keys(res.body).length).toBe(1); 
            expect(res.body.some(g => g.name === "Genre99")).toBeTruthy();
                       
        });

        it('should return a 404 if invalid id is passed', async () => {
            
            const res = await request(server).get('/api/genres/1');
            
            expect(res.statusCode).toBe(404);
                    
        });
    });


    describe('post /', () => {
        let token;
        let name;

        beforeEach(() => {
            token= new User().generateAuthToken();
            name='Genre1';
        })

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token',token)
                .send({name});
        }
        
        it('should return 401 if client is not logged in',async () => {
            token='';
            const res = await exec();
            expect(res.statusCode).toBe(401);
        });

        it('should return 400 if genre is less than 3 chars',async () => {
            name='12';
            const res = await exec();
            expect(res.statusCode).toBe(400);
        });
    });


});

