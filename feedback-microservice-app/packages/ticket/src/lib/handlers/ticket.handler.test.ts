import {
    FastifyHttpProvider,
    parseUuid,
    Uuid,
} from '@procter-gamble/apip-api-types';
import { validate as uuidValidate } from 'uuid';
import { Response } from 'light-my-request';
import { fastifyRequestContextMiddleware } from '@procter-gamble/apip-context-middleware';
import { JwtMiddleware, JwtOptions } from '@procter-gamble/apip-jwt-middleware';
import { createSigner } from 'fast-jwt';
import { ResourceNotFoundError } from '../errors/resource.not.found.error';
import { GeneralAPIError } from '../errors/general.api.error';
import { Constants } from '../models/constants';
import { formatString } from '../utils/format.string';
import { TicketService } from '../services/ticket.service';
import { TicketRouter } from './ticket.router';
import { TicketHandler } from './ticket.handler'

const serviceMock = jest.genMockFromModule<TicketService>(
    '../services/ticket.service'
);

const ticketRequest =
{
    participants: [
        {
            profileId: "557cd845-2349-46c9-9655-b18cbf20d7d7",
            addedBy: "ac2bc356-7aa5-46dc-a925-9dbe82a678e6",
            status: "RESPONSIBLE"
        }
    ],
    messages:
    {
        summary: "TestMessage123",
        description: "TestMessage123",
        status: "NEW",
        createdBy: "6573fca6-a913-11ed-afa1-0242ac120007",
        attachmentIds: null
    }
}
const ticket = {
    id: parseUuid('f428dc35-f893-455a-b01d-3e8a6bec126a'),
    status: "NEW",
    summary: "TestMessage123",
    description: "TestMessage123",
    messageIds: [
        "96ff50ac-d526-4860-8db7-ebf4de6e1617"
    ],
    attachmentIds: null,
    participants: [
        {
            profileId: "557cd845-2349-46c9-9655-b18cbf20d7d7",
            addedBy: "ac2bc356-7aa5-46dc-a925-9dbe82a678e6",
            status: "RESPONSIBLE"
        }
    ]
};

const invalidTicket = {
    id: '10',
    status: "NEW",
    summary: "TestMessage123",
    description: "TestMessage123",
    messageIds: [
        "96ff50ac-d526-4860-8db7-ebf4de6e1617"
    ],
    attachmentIds: null,
    participants: [
        {
            profileId: "557cd845-2349-46c9-9655-b18cbf20d7d7",
            addedBy: "ac2bc356-7aa5-46dc-a925-9dbe82a678e6",
            status: "RESPONSIBLE"
        },
    ]
};
let Runtime: FastifyHttpProvider;
const secret =
    'e98256815795d097dc84594fe5bcf6c55d90d11f04b25e814c7a4bff90667bfb';
const claims = {
    sub: '9d5e2642-f1c6-4c36-9f81-b6ed9ae14829',
    name: 'A ticket',
    aud: 'app-1',
};
const validSigner = createSigner({ key: secret, expiresIn: 300000 });

beforeEach(async () => {
    jest.clearAllMocks();
    Runtime = new FastifyHttpProvider({});

    await Runtime.instance.register(fastifyRequestContextMiddleware);
    await Runtime.instance.register(JwtMiddleware, {
        key: 'e98256815795d097dc84594fe5bcf6c55d90d11f04b25e814c7a4bff90667bfb',
        errorHandler: (err, reply) => {
            reply.log.error(err);
            reply.status(401).send({ unauthorized: 'you' });
        },
    } as JwtOptions);

    new TicketRouter(Runtime, new TicketHandler(serviceMock));

    await Runtime.instance.ready();
});

describe('TicketHandler get tests', () => {
    it.each`
        testName                        | ticket                  | expectedStatusCode | serviceMockReturn                                                                                                                                                                                                                                         | expectedError                                                                                                                                                                   | token
        ${'401 without Jwt'}            | ${[ticket]}             | ${401}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                                                                                              | ${{ unauthorized: 'you' }}                                                                                                                                                      | ${null}
        ${'200 with Jwt'}               | ${[ticket]}             | ${200}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                                                                                              | ${null}                                                                                                                                                                         | ${validSigner(claims)}
        ${'200 when no objects return'} | ${[]}                   | ${200}             | ${{ type: 'error', data: new ResourceNotFoundError(Constants.errors.notFound.ticket.CODE).withTitle(Constants.errors.notFound.ticket.TITLE).withReason(formatString(Constants.errors.notFound.ticket.MESSAGE, '728cb5aa-9eb1-4d61-a81d-9ef3026c3ab7')) }} | ${null}                                                                                                                                                                         | ${validSigner(claims)}
        ${'400 with invalidId'}         | ${[{ id: 'not-uuid' }]} | ${400}             | ${null}                                                                                                                                                                                                                                                   | ${null}                                                                                                                                                                         | ${validSigner(claims)}
        ${'400 when service error'}     | ${[]}                   | ${400}             | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE) }}                                                                                                                                                                       | ${{ reason: 'GENERAL API ERROR', code: Constants.errors.generalError.CODE, instance: 'exists', pointer: '', title: Constants.errors.generalError.TITLE, rootCauses: 'exists' }} | ${validSigner(claims)}
    `(
        '$testName',
        async ({
            ticket,
            expectedStatusCode,
            serviceMockReturn,
            expectedError,
            token,
        }) => {
            serviceMock.getById = jest
                .fn()
                .mockResolvedValue(serviceMockReturn);
            let id = ticket[0]?.id;
            if (id !== 'not-uuid' && !uuidValidate(id)) {
                id = Uuid();
            }
            let response: Response;
            if (token) {
                const headers = {
                    authorization: `Bearer ${token}`,
                };
                response = await Runtime.instance.inject({
                    method: 'GET',
                    url: `/tickets/${id}`,
                    headers: headers,
                });
            } else {
                response = await Runtime.instance.inject({
                    method: 'GET',
                    url: `/tickets/${ticket.id}`,
                });
            }

            expect(response.statusCode).toEqual(expectedStatusCode);
            const payload = JSON.parse(response.payload);
            if (expectedStatusCode == 200) {
                expect(payload).toEqual(ticket);
            } else if (expectedStatusCode == 401) {
                for (const [key, value] of Object.entries(expectedError)) {
                    if (key === 'rootCauses') {
                        for (const [key, value] of Object.entries(
                            expectedError.rootCauses[0]
                        )) {
                            if (value === 'exists') {
                                expect(payload).toHaveProperty(key);
                            } else {
                                expect(payload).toHaveProperty(key, value);
                            }
                        }
                    } else {
                        if (value === 'exists') {
                            expect(payload).toHaveProperty(key);
                        } else {
                            expect(payload).toHaveProperty(key, value);
                        }
                    }
                }
            } else {
                if (expectedError) {
                    checkProperties(expectedError, payload);
                }
            }
        }
    );
});

describe('TicketHandler getCollection tests', () => {
    it.each`
        testName                     | ticket      | expectedStatusCode | serviceMockReturn                                                                                                                                                                                                                              | expectedError
        ${'200 with value'}          | ${[ticket]} | ${200}             | ${{ type: 'ok', data: { type: 'collection', value: [ticket] } }}                                                                                                                                                                               | ${null}
        ${'200 with no value'}       | ${[]}       | ${200}             | ${{ type: 'ok', data: { type: 'collection', value: [] } }}                                                                                                                                                                                     | ${null}
        ${'400 when service errors'} | ${[]}       | ${400}             | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.repository.ticket.storageProvider.undefined.CODE, '', Constants.errors.repository.ticket.storageProvider.undefined.TITLE, Constants.errors.repository.ticket.storageProvider.undefined.MESSAGE) }} | ${{ reason: 'GENERAL API ERROR', code: Constants.errors.repository.ticket.storageProvider.undefined.CODE, instance: 'exists', pointer: '', title: Constants.errors.generalError.TITLE, rootCauses: 'exists' }}
    `(
        '$testName',
        async ({
            ticket,
            expectedStatusCode,
            serviceMockReturn,
            expectedError,
        }) => {
            serviceMock.getCollection = jest
                .fn()
                .mockResolvedValue(serviceMockReturn);
            const response = await Runtime.instance.inject({
                method: 'GET',
                url: '/tickets',
                headers: {
                    authorization: `Bearer ${validSigner(claims)}`,
                },
            });
            easyChecks(response, expectedStatusCode, ticket, expectedError);
        }
    );
});

describe('TicketHandler post tests', () => {
    it.each`
        testName                     | ticket           | expectedStatusCode | serviceMockReturn                                                                                                                                                                    | expectedError
        ${'201 with Valid ticket'}   | ${ticketRequest} | ${201}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${null}
        ${'400 with Invalid ticket'} | ${invalidTicket} | ${400}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${{ reason: Constants.errors.validation.ticket.create.MESSAGE, code: Constants.errors.validation.ticket.create.CODE, instance: 'exists', pointer: '', title: Constants.errors.validation.ticket.create.TITLE, rootCauses: 'exists' }}
        ${'400 with service error'}  | ${ticketRequest} | ${400}             | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE).withReason(Constants.errors.generalError.MESSAGE).withTitle(Constants.errors.generalError.TITLE) }} | ${{ reason: Constants.errors.generalError.MESSAGE, code: Constants.errors.generalError.CODE, instance: 'exists', pointer: '', title: Constants.errors.generalError.TITLE, rootCauses: 'exists' }}
    `(
        '$testName',
        async ({
            ticket,
            expectedStatusCode,
            serviceMockReturn,
            expectedError,
        }) => {
            serviceMock.create = jest.fn().mockResolvedValue(serviceMockReturn);
            const response = await Runtime.instance.inject({
                method: 'POST',
                url: '/tickets',
                headers: {
                    authorization: `Bearer ${validSigner(claims)}`,
                },
                payload: ticket,
            });
            expect(response.statusCode).toEqual(expectedStatusCode);
            const {messages,...rest}=ticket
            const payload = JSON.parse(response.payload);
            if (expectedStatusCode == 201) {
                expect(payload).toEqual({
                    ...rest,
                    id:payload.id,
                    status: payload.status,
                    summary: payload.summary,
                    description: payload.description,
                    messageIds:payload.messageIds,
                   attachmentIds: payload.attachmentIds,
                });
            } else {
                checkProperties(expectedError, payload);
            }
        }
    );
});

describe('TicketHandler update tests', () => {
    it.each`
        testName                       | ticket                | expectedStatusCode | serviceMockReturn                                                                                                                                                                    | expectedError
        ${'200 with Valid ticket'}     | ${ticket}             | ${200}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${null}
        ${'400 with invalid ticketId'} | ${{ id: 'not-uuid' }} | ${400}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${{ reason: Constants.errors.handler.ticket.update.MESSAGE, code: Constants.errors.handler.ticket.update.CODE, instance: 'exists', pointer: '', title: Constants.errors.handler.ticket.update.TITLE, rootCauses: 'exists' }}
        ${'400 with service error'}    | ${ticket}             | ${400}             | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE).withReason(Constants.errors.generalError.MESSAGE).withTitle(Constants.errors.generalError.TITLE) }} | ${{ reason: Constants.errors.generalError.MESSAGE, code: Constants.errors.generalError.CODE, instance: 'exists', pointer: '', title: Constants.errors.generalError.TITLE, rootCauses: 'exists' }}
    `(
        '$testName',
        async ({
            ticket,
            expectedStatusCode,
            serviceMockReturn,
            expectedError,
        }) => {
            let id = ticket.id;
            if (id !== 'not-uuid' && !uuidValidate(id)) {
                id = Uuid();
            }
            serviceMock.update = jest.fn().mockResolvedValue(serviceMockReturn);
            const response = await Runtime.instance.inject({
                method: 'PUT',
                url: `/tickets/${id}`,
                headers: {
                    authorization: `Bearer ${validSigner(claims)}`,
                },
                payload: ticket,
            });
            easyChecks(response, expectedStatusCode, ticket, expectedError);
        }
    );
});

describe('TicketHandler delete tests', () => {
    it.each`
        testName                       | ticket                | expectedStatusCode | serviceMockReturn                                                                                                                                                                    | expectedError
        ${'204 with Valid ticket'}     | ${ticket}             | ${204}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${null}
        ${'400 with invalid ticketId'} | ${{ id: 'not-uuid' }} | ${400}             | ${{ type: 'ok', data: { type: 'resource', value: ticket } }}                                                                                                                         | ${{ reason: Constants.errors.handler.ticket.delete.MESSAGE, code: Constants.errors.handler.ticket.delete.CODE, instance: 'exists', pointer: '', title: Constants.errors.handler.ticket.delete.TITLE, rootCauses: 'exists' }}
        ${'400 with service error'}    | ${ticket}             | ${400}             | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE).withReason(Constants.errors.generalError.MESSAGE).withTitle(Constants.errors.generalError.TITLE) }} | ${{ reason: Constants.errors.generalError.MESSAGE, code: Constants.errors.generalError.CODE, instance: 'exists', pointer: '', title: Constants.errors.generalError.TITLE, rootCauses: 'exists' }}
    `(
        '$testName',
        async ({
            ticket,
            expectedStatusCode,
            serviceMockReturn,
            expectedError,
        }) => {
            serviceMock.delete = jest.fn().mockResolvedValue(serviceMockReturn);
            const response = await Runtime.instance.inject({
                method: 'DELETE',
                url: `/tickets/${ticket.id}`,
                headers: {
                    authorization: `Bearer ${validSigner(claims)}`,
                },
            });
            expect(response.statusCode).toEqual(expectedStatusCode);
            if (expectedStatusCode != 204) {
                checkProperties(expectedError, JSON.parse(response.payload));
            }
        }
    );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkProperties = (expectedError: any, payload: any) => {
    for (const [key, value] of Object.entries(expectedError)) {
        if (value === 'exists') {
            expect(payload).toHaveProperty(key);
        } else {
            expect(payload).toHaveProperty(key, value);
        }
    }
};

const easyChecks = (
    response: Response,
    expectedStatusCode: unknown,
    ticket: unknown,
    expectedError: unknown
) => {
    expect(response.statusCode).toEqual(expectedStatusCode);
    const payload = JSON.parse(response.payload);
    if (expectedStatusCode == 200) {
        expect(payload).toEqual(ticket);
    } else {
        checkProperties(expectedError, payload);
    }
};
