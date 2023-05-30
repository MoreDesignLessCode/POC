import { match } from 'ts-pattern';
import {
    APIError,
    DefaultRequestContext,
    IContext,
    parseUuid,
    Uuid,
} from '../../../../../../dist/packages/api';
import * as dotenv from 'dotenv';
import * as Pg from 'pg';
import { formatString } from '../../utils/format.string';
import { Constants } from '../../models/constants';
import { ResourceNotFoundError } from '../../errors/resource.not.found.error';
import { MessagePgStorageProvider } from './message.pg.storage.provider';
import { Messages } from '../../models';

dotenv.config();

let testStorageProvider: MessagePgStorageProvider;
let testMessage: Messages;
let testNewMessage: any;
let context: IContext;

beforeAll(async () => {
    testStorageProvider = new MessagePgStorageProvider();
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
        "DELETE FROM feedbackmktpl.messages WHERE artifact_id='da92efff-a342-48b9-a0eb-bed7aec7eff4';"
    );
    await client.query(
        "DELETE FROM feedbackmktpl.artifacts WHERE id='da92efff-a342-48b9-a0eb-bed7aec7eff4';"
    )

    client.end();
});

beforeEach(async () => {
    jest.clearAllMocks();

    const client: Pg.Client = connectToDatabase();
    let artifactId = 'da92efff-a342-48b9-a0eb-bed7aec7eff4'
    await client.query(`INSERT INTO feedbackmktpl.artifacts(id,ref_value,ref_type) values ('da92efff-a342-48b9-a0eb-bed7aec7eff4','46abbedf-d9b3-4e25-a438-4ff4d8c476ec','TICKET')`)
    const insertMessages = await client.query(
        'INSERT INTO feedbackmktpl.messages (id,artifact_id,summary,description,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
        [
            parseUuid('84b90e6f-8bd6-498a-864f-65e21c87dbe6'),
            parseUuid('da92efff-a342-48b9-a0eb-bed7aec7eff4'),
            "Unit test message",
            "Unit test description",
            1,
            new Date().toISOString(),
            Uuid(),

        ]
    );
    client.end();

    testMessage = {
        messageid: parseUuid('84b90e6f-8bd6-498a-864f-65e21c87dbe6'),
        summary: "Unit test message",
        description: "Unit test description",
        status: "NEW",
        attachmentids:null
    };
    testNewMessage =[ {
        id: parseUuid('ef50c050-17a5-45df-88a5-ae88ed1d3909'),
        artifactIdValue: parseUuid('46abbedf-d9b3-4e25-a438-4ff4d8c476ec'),
        summary: "Unit new test message",
        description: "Unit new test description",
        status: "NEW",
        artifactType:"TICKET"
    }];
});

const maybe = process.env.FEEDBACK_DAS_JEST_ALLOW_INTEG
    ? describe
    : describe.skip;

maybe('Integration Tests', () => {
    describe('all function test', () => {
        it('the all function should return all tickets in the repo', async () => {
            context.set('id',['84b90e6f-8bd6-498a-864f-65e21c87dbe6'])
            const {attachmentids,messageid,... rest}=testMessage
            const result = await testStorageProvider.all(context);
            match(result)
                .with({ type: 'ok' }, (res) => {
                    expect(res.data.value[0]).toEqual(
                        expect.objectContaining({
                           description:expect.any(String),
                           summary:expect.any(String),
                           id:undefined,
                           attachments:null,
                           createdBy:undefined
                        })
                    )
                })
                .with({ type: 'error' }, () => {
                    expect(false).toBe(true);
                })
                .exhaustive();
        });
    });

    describe('find function test', () => {
        it.each`
            testName                         | id
            ${'ok when id does exist'}       | ${parseUuid('84b90e6f-8bd6-498a-864f-65e21c87dbe6')}
            ${'fail when id does not exist'} | ${parseUuid('ef50c050-17a5-45df-88a5-ae88ed1d3909')}
        `('$testName', async ({ id }) => {
            const result = await testStorageProvider.findById(id, context);
            match(result)
                .with({ type: 'ok' }, (res) => {
                    expect(res.data.value).toEqual([testMessage]);
                })
                .with({ type: 'error' }, () => {
                    expect((result.data as APIError).reason).toEqual(
                        formatString(
                            Constants.errors.notFound.message.MESSAGE,
                            id
                        )
                    );
                })
                .exhaustive();
        });
    });

    describe('create function test', () => {
        it('create should add a message object to the repo', async () => {
            const message = await testStorageProvider.create(
                testNewMessage,
                context
            );
            const {artifactIdValue,artifactType,...rest}=testNewMessage[0];
            match(message)
                .with({ type: 'ok' }, (res) => {
                context.set('id',[res.data.value.id])
                expect(res.data.value).toEqual({
                    ...rest,
                    id:res.data.value.id,
                    attachmentids:null,
                    created_by:res.data.value.created_by
                })
                })
                .with({ type: 'error' }, () => {
                    expect(false).toBe(true);
                })
                .exhaustive();
                
            const result = await testStorageProvider.all(context);
            match(result)
                .with({ type: 'ok' }, (res) => {
                    expect(res.data.value[0]).toEqual(
                        expect.objectContaining({
                           description:expect.any(String),
                           summary:expect.any(String),
                           id:undefined,
                           attachments:null,
                           createdBy:undefined
                        })
                    )
                })
                .with({ type: 'error' }, () => {
                    expect(false).toBe(true);
                })
                .exhaustive();
        });
    });

    describe('save function test', () => {
        it('saving a message object should return an updated message', async () => {
            testMessage.description = 'The message is edited';

            const result = await testStorageProvider.save(
                parseUuid('84b90e6f-8bd6-498a-864f-65e21c87dbe6'),
                testMessage,
                context
            );
            match(result)
                .with({ type: 'ok', data: { type: 'resource' } }, (result) => {
                    expect(result.data.value.description).toBe('The message is edited');
                })
                .with({ type: 'ok', data: { type: 'collection' } }, () =>
                    expect(false).toBe(true)
                )
                .with({ type: 'error' }, () => expect(false).toBe(true))
                .exhaustive();
        });

        it("should fail if it can't match id", async () => {
            const id = parseUuid('57f10413-e9de-4f6d-ac11-4f4bc6ee40da');
            match(await testStorageProvider.save(id, testMessage, context))
                .with({ type: 'error' }, (result) => {
                    expect(result.data.reason).toEqual(
                        formatString(
                            Constants.errors.notFound.message.MESSAGE,
                            id
                        )
                    );
                })
                .with({ type: 'ok' }, () => expect(false).toBe(true))
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
