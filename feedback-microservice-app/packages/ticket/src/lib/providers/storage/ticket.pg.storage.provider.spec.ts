import { match } from 'ts-pattern';
import {
    APIError,
    DefaultRequestContext,
    IContext,
    Uuid,
    parseUuid,
} from '@procter-gamble/apip-api-types';
import * as dotenv from 'dotenv';
import * as Pg from 'pg';
import { TicketPgStorageProvider } from './ticket.pg.storage.provider';
import { Tickets } from '../../models/ticket';
import { formatString } from '../../utils/format.string';
import { Constants } from '../../models/constants';
import { ResourceNotFoundError } from '../../errors/resource.not.found.error';

dotenv.config();

let testStorageProvider: TicketPgStorageProvider;
let testTicket: Tickets;
let testNewTicket: Tickets;
let context: IContext;

beforeAll(async () => {
    testStorageProvider = new TicketPgStorageProvider();
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZDVlMjY0Mi1mMWM2LTRjMzYtOWY4MS1iNmVkOWFlMTQ4MjkiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.J7Wu0q_ROzCTTjkFfd_2PxOX9w-YPJKFYZ_yb3fGTjA';
    context = new DefaultRequestContext();
    context.set(
        'auth:claims',
        JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    );
    context.set('auth:token', token);
});

afterAll(async () => {
    await testStorageProvider.client.end();
});

afterEach(async () => {
    // clear test data from DB
    const client: Pg.Client = connectToDatabase();
    await client.query(
        "DELETE FROM feedbackmktpl.ticket WHERE id='b4da21bc-b7af-4614-bc2a-be6d207efbfe';"
    );

   
    await client.query(
        "DELETE FROM feedbackmktpl.attachments WHERE id='fee4fbe2-40d9-4452-b87a-8f7a60352cbf';"
    );
    await client.query(
        "DELETE FROM feedbackmktpl.messages WHERE id='9185df91-64e2-4d08-883c-a919159a4e33';"
    );
    await client.query(
        "DELETE FROM feedbackmktpl.participants WHERE id='396cce93-aae4-4177-a831-318f7f5889e5';"
    );
    await client.query(
        "DELETE FROM feedbackmktpl.artifacts WHERE id='517ff48f-faf2-4ab9-8a13-a192a859609c';"
    );

   
    client.end();
});

beforeEach(async () => {
    jest.clearAllMocks();

    const client: Pg.Client = connectToDatabase();
   
    const insertTicket = await client.query(
        'INSERT INTO feedbackmktpl.ticket (id,created_at,created_by) VALUES ($1,$2,$3);',
        [
            parseUuid('b4da21bc-b7af-4614-bc2a-be6d207efbfe'),
            new Date().toISOString(),
            parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820')
        ]
    )
    const insertArtifact = await client.query(
        'INSERT INTO feedbackmktpl.artifacts (id,ref_value,ref_type,created_at,created_by) VALUES ($1,$2,$3,$4,$5);',
        [
            parseUuid('517ff48f-faf2-4ab9-8a13-a192a859609c'),
            parseUuid('b4da21bc-b7af-4614-bc2a-be6d207efbfe'),
            "TICKET",
            new Date().toISOString(),
            parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820')
        ]
    );

        await client.query(
            'INSERT INTO feedbackmktpl.participants (id,profile_id,artifact_id,added_by,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
            [
                parseUuid('396cce93-aae4-4177-a831-318f7f5889e5'),
                parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820'),
                parseUuid('517ff48f-faf2-4ab9-8a13-a192a859609c'),
                parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820'),
                1,
                new Date().toISOString(),
                parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820')
            ]
        );
       await client.query(
        'INSERT INTO feedbackmktpl.messages (id,artifact_id,summary,description,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
        [
            parseUuid('9185df91-64e2-4d08-883c-a919159a4e33'),
            parseUuid('517ff48f-faf2-4ab9-8a13-a192a859609c'),
            "TEST SUMMARY",
            "TEST DESCRIPTION",
            6,
            new Date().toISOString(),
            parseUuid('0b1ca164-1b4d-4618-b5ec-9d049d0ab820')
        ]
    );
    client.end();

    testTicket = {
        id: parseUuid('5f922298-6219-4488-857a-e0d7bd711baf'),
        createdBy: parseUuid('618c128c-d0a7-46d7-a7c3-4fe978a10258'),
        status: "NEW",
        summary: "UNIT TEST SUMMARY",
        description: "UNIT TEST DESCRIPTION",
        messageIds: [parseUuid('0bb2c4a6-8ad8-4134-a37a-49721981aa58')],
        participantIds: [parseUuid('5da51500-fd74-41c7-a255-7448fa3d2e4f')],
        messages: [{
            id: parseUuid('0bb2c4a6-8ad8-4134-a37a-49721981aa58'),
            summary: "UNIT TEST SUMMARY",
            description: "UNIT TEST DESCRIPTION",
            status: "NEW",
            createdBy: parseUuid('618c128c-d0a7-46d7-a7c3-4fe978a10258')
        }],
        participants: [{
            id: parseUuid('5da51500-fd74-41c7-a255-7448fa3d2e4f'),
            createdBy: parseUuid('618c128c-d0a7-46d7-a7c3-4fe978a10258'),
            status: "RESPONSIBLE"
        }]
    }

    testNewTicket = {
        id: parseUuid('a262023a-0bcd-40a2-9725-01727d163782'),
        createdBy: parseUuid('0f996867-84d2-46be-a083-f6b509c89f82'),
        status: "NEW",
        summary: "Summary of the message2",
        description: "Description of the message3",
        messageIds: [parseUuid('c320fd96-e63c-4a36-a873-1a94c25be467')],
        participantIds: [parseUuid('23c90175-d16f-4d99-85ac-cc5d8b5fc89b')],
        messages: [{
            id: parseUuid('c320fd96-e63c-4a36-a873-1a94c25be467'),
            summary: "Summary of the message",
            description: "Description of the message",
            status: "NEW",
            createdBy: parseUuid('0f996867-84d2-46be-a083-f6b509c89f82')
        }],
        participants: [{
            id: parseUuid('23c90175-d16f-4d99-85ac-cc5d8b5fc89b'),
            createdBy: parseUuid('0f996867-84d2-46be-a083-f6b509c89f82'),
            status: "RESPONSIBLE"
        }]


    }
});

const maybe = process.env.FEEDBACK_DAS_JEST_ALLOW_INTEG
    ? describe
    : describe.skip;

maybe('Integration Tests', () => {
    // describe('all function test', () => {
    //     it('the all function should return all tickets in the repo', async () => {
    //         const result = await testStorageProvider.all(context);
    //         match(result)
    //             .with({ type: 'ok' }, (res) => {
    //                 expect(res.data.value).toContainEqual(testTicket);
    //             })
    //             .with({ type: 'error' }, () => {
    //                 expect(false).toBe(true);
    //             })
    //             .exhaustive();
    //     });
    // });

    describe('find function test', () => {
        it.each`
            testName                         | id
            ${'ok when id does exist'}       | ${parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40d3')}
            ${'fail when id does not exist'} | ${parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40da')}
        `('$testName', async ({ id }) => {
            const result = await testStorageProvider.findById(id, context);
            match(result)
                .with({ type: 'ok' }, (res) => {
                    expect(res.data.value).toEqual(testTicket);
                })
                .with({ type: 'error' }, () => {
                    expect((result.data as APIError).reason).toEqual(
                        formatString(
                            Constants.errors.notFound.ticket.MESSAGE,
                            id
                        )
                    );
                })
                .exhaustive();
        });
    });

    // describe('create function test', () => {
    //     it('create should add a ticket object to the repo', async () => {
    //         const ticket = await testStorageProvider.create(
    //             testNewTicket,
    //             context
    //         );

    //         match(ticket)
    //             .with({ type: 'ok' }, () => {
    //                 // ok
    //             })
    //             .with({ type: 'error' }, () => {
    //                 expect(false).toBe(true);
    //             })
    //             .exhaustive();

    //         const result = await testStorageProvider.all(context);
    //         match(result)
    //             .with({ type: 'ok' }, (result) => {
    //                 expect(result.data.value).toContainEqual(testNewTicket);
    //             })
    //             .with({ type: 'error' }, () => {
    //                 expect(false).toBe(true);
    //             })
    //             .exhaustive();
    //     });
    // });

    describe('save function test', () => {
        it('saving a person object should return an updated person', async () => {
            testTicket.participants[0].status = 'CONSULTING';

            const result = await testStorageProvider.save(
                parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40d3'),
                testTicket,
                context
            );
            match(result)
                .with({ type: 'ok', data: { type: 'resource' } }, (result) => {
                    expect(result.data.value.status).toBe('CONSULTING');
                })
                .with({ type: 'ok', data: { type: 'collection' } }, () =>
                    expect(false).toBe(true)
                )
                .with({ type: 'error' }, () => expect(true).toBe(true))
                .exhaustive();
        });

        it("should fail if it can't match id", async () => {
            const id = parseUuid('b084cc06-3e24-40ec-bc2b-3200bc2120d5');
            match(await testStorageProvider.save(id, testTicket, context))
                .with({ type: 'error' }, (result) => {
                    expect(result.data.reason).toEqual(
                        formatString(
                            Constants.errors.notFound.ticket.MESSAGE,
                            id
                        )
                    );
                })
                .with({ type: 'ok' }, () => expect(true).toBe(true))
                .exhaustive();
        });
    });

    describe('delete function test', () => {
        it.each`
            testName                         | id
            ${'ok when id does exist'}       | ${parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40d3')}
            ${'fail when id does not exist'} | ${parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40da')}
        `('$testName', async ({ id }) => {
            const result1 = await testStorageProvider.delete(id, context);
            match(result1)
                .with({ type: 'ok' }, () => {
                    // ok
                })
                .with({ type: 'error' }, (res) => {
                    expect(res.data).toBeInstanceOf(ResourceNotFoundError);
                });

            const result2 = await testStorageProvider.delete(id, context);
            match(result2)
                .with({ type: 'error' }, (res) => {
                    expect(res.data).toBeInstanceOf(ResourceNotFoundError);
                })
                .with({ type: 'ok' }, () => {
                    expect(false).toBe(true);
                })
                .exhaustive();
        });
    });
});

const connectToDatabase = (): Pg.Client => {
    const connString = `postgresql://${process.env.FEEDBACK_DAS_DB_USER}:${process.env.FEEDBACK_DAS_DB_PASSWORD}@${process.env.FEEDBACK_DAS_DB_HOST}:${process.env.FEEDBACK_DAS_DB_PORT}/${process.env.FEEDBACK_DAS_DB_NAME}`;

    const client: Pg.Client = new Pg.Client({
        connectionString: connString,
    });
    client.connect();
    return client;
};
