const assert = require('assert');
const entityService = require('../../src/entity/entity.service');
const dbConfig = require('../../src/config/database');

describe('Entity Service Test', () => {

    describe('#createEntity()', () => {
        it('Should create an entity', () => {
          entityService.createEntity('Test Entity', 'TE', new Date(), true)
            .then(entity => {
                assert.strictEqual(entity.name, "Test Entity");
                assert.notStrictEqual(entity, null);
            })
        });
    });

    describe('#insertEntity', () => {
        it('Should insert an entity in database', () => {
            entityService.createEntity('Test Entity', 'TE', new Date(), true)
                .then(entity => entityService.insertEntity(entity))
                .then(entity => {
                    assert.notStrictEqual(entity._id, null);
                    assert.strictEqual(entity.name, 'Test Entity');
                })
                .catch(err => assert.fail(err));
        });
    });

    describe('#updateEntity', () => {
        it('Should update an entity in database', () => {
            entityService.createEntity('Test Entity', 'TE', new Date(), true)
                .then(entity => entityService.insertEntity(entity))
                .then(entity => {
                    entity.code = 'TE2';
                    entityService.updateEntity(entity).then(e => {
                        assert.strictEqual(e.code, entity.code);
                    });
                })
                .catch(err => assert.fail(err));
        });
    })

    describe('#findEntity', () => {
        it('Should return a list of entities', () => {
            const query = {'code' : 'TE3'};
            entityService.createEntity(null, 'Test Entity', 'TE3', new Date(), true)
                .then(entity => entityService.insertEntity(entity))
                .then(entity => entityService.findEntity(query))
                .then(entities => {
                    assert.strictEqual(entities.length, 1);
                });
        });
    });

    describe('#buildQuery', () => {
        it('Should return the database query', () => {
            const query = {'code' : 'TE3'};
            const queryRes = entityService.buildQuery(query);
            assert.notStrictEqual(queryRes, null);
        });
    });

    after(() => { 
        console.log("Cleaning connections and tables ENTITY");
        setTimeout(() => {
            dbConfig.getConnection()
                .then(db => {
                    db.collection(entityService.ENTITY_COLLECTION).deleteMany({'name' : 'Test Entity'}, (err, res) => {
                    console.log("Collection cleans: ENTITY -> " + res);
                });
            })
            .catch(err => assert.fail(err));
        }, 2000);
    });

});