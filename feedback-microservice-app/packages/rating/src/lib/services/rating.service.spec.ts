import {
    Uuid,
    IContext,
    DefaultRequestContext,
    Result,
} from '@procter-gamble/apip-api-types';
import { parseUuid } from '@procter-gamble/apip-api-types/src/lib';
import { match } from 'ts-pattern';
import { GeneralAPIError } from '../errors/general.api.error';
import { Constants } from '../models/constants';
import { Ratings } from '../models/rating';
import { RatingRepository } from '../repositories/rating.repo';
import { RatingService } from './rating.service';

const repositoryMock = jest.genMockFromModule<RatingRepository>(
    '../repositories/rating.repo'
);
let fixture: RatingService;
const rating: Ratings = {
    id: parseUuid("499430c7-438f-46e6-8bce-2ad5c12061ba"),
    rating: 1,
    status: "NEW",
    summary: "TestMessage123",
    description: "TestMessage123",
    messageIds: [
        parseUuid("5ac0388e-b13c-414d-b0d2-b81e3ce860bb")
    ],
    participantIds: [
        parseUuid( "902406bd-e443-4cb7-935d-239fc8a88957"),
        parseUuid("65e678be-9b08-4bca-ae56-45a26a54673b")
    ],
    messages: [
        {
            summary: "TestMessage123",
            status: "NEW",
            description: "TestMessage123",
            id:parseUuid( "5ac0388e-b13c-414d-b0d2-b81e3ce860bb")
        }
    ],
    participants: [
        {
            profile_id: parseUuid("743558c1-e097-4d52-a63d-6c9030fc2c47"),
            addedBy: parseUuid("5f326205-e259-492c-a76b-67c78b8f865d"),
            status:"RESPONSIBLE"
        },
        {
            profile_id:parseUuid("9073cb64-c579-4033-9380-87e1e7753c2f"),
            addedBy: parseUuid("196af4c2-3f8a-4ffc-b438-a544a7ec9336"),
            status:"RESPONSIBLE"
        }
    ]
};

const context: IContext = new DefaultRequestContext();
context.set<string>('authorization:token:sub', rating.id);

beforeEach(() => {
    jest.clearAllMocks();
    fixture = new RatingService(repositoryMock);
});

describe('RatingService all tests', () => {
    it.each`
        testName  | mockResolvedValue
        ${'ok'}   | ${{ type: 'ok', data: { type: 'collection', value: [] } }}
        ${'fail'} | ${{ type: 'error', data: Error('Service Error') }}
    `('$testName', async ({ mockResolvedValue }) => {
        repositoryMock.all = jest.fn().mockResolvedValue(mockResolvedValue);
        const result = await fixture.getCollection(context);

        match(result)
            .with({ type: 'ok' }, () => {
                expect(repositoryMock.all).toHaveBeenCalled();
            })
            .with({ type: 'error' }, (res) => {
                expect(res.data.reason === 'Service Error');
            })
            .exhaustive();
    });
});

describe('RatingService getById tests', () => {
    it.each`
        testName  | rating    | mockResolvedValue
        ${'ok'}   | ${rating} | ${{ type: 'ok', data: { type: 'resource', value: rating } }}
        ${'fail'} | ${rating} | ${{ type: 'error', data: Error('Service Error') }}
    `('$testName', async ({ rating, mockResolvedValue }) => {
        repositoryMock.find = jest.fn().mockResolvedValue(mockResolvedValue);
        const result = await fixture.getById(rating.id, context);

        match(result)
            .with({ type: 'ok' }, (res) => {
                expect(repositoryMock.find).toHaveBeenCalled();
                expect(res.data.value).toEqual(rating);
            })
            .with({ type: 'error' }, (res) => {
                expect(res.data.reason === 'Service Error');
            })
            .exhaustive();
    });
});

describe('RatingService add tests', () => {
    it.each`
        testName  | rating    | mockResolvedValue
        ${'ok'}   | ${rating} | ${{ type: 'ok', data: { type: 'resource', value: rating } }}
        ${'fail'} | ${rating} | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE) }}
    `('$testName', async ({ rating, mockResolvedValue }) => {
        repositoryMock.create = jest.fn().mockResolvedValue(mockResolvedValue);
        const result = await fixture.create(
            rating,
            new DefaultRequestContext()
        );
        matchOkOrError(repositoryMock.create, result, rating);
    });
});

describe('RatingService update tests', () => {
    it.each`
        testName  | rating    | mockResolvedValue
        ${'ok'}   | ${rating} | ${{ type: 'ok', data: { type: 'resource', value: rating } }}
        ${'fail'} | ${rating} | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE) }}
    `('$testName', async ({ rating, mockResolvedValue }) => {
        repositoryMock.update = jest.fn().mockResolvedValue(mockResolvedValue);
        const result = await fixture.update(rating.id, rating, context);
        matchOkOrError(repositoryMock.update, result, rating);
    });
});

describe('RatingService delete tests', () => {
    it.each`
        testName  | rating    | mockResolvedValue
        ${'ok'}   | ${rating} | ${{ type: 'ok', data: { type: 'resource', value: rating } }}
        ${'fail'} | ${rating} | ${{ type: 'error', data: new GeneralAPIError(Constants.errors.generalError.CODE) }}
    `('$testName', async ({ rating, mockResolvedValue }) => {
        repositoryMock.delete = jest.fn().mockResolvedValue(mockResolvedValue);
        const result = await fixture.delete(rating.id, context);
        matchOkOrError(repositoryMock.delete, result, rating);
    });
});

const matchOkOrError = (
    mockFunction: unknown,
    result: Result<Ratings>,
    rating: unknown
): void => {
    match(result)
        .with({ type: 'ok' }, (res) => {
            expect(mockFunction).toHaveBeenCalled();
            expect(res.data.value).toEqual(rating);
        })
        .with({ type: 'error' }, (res) => {
            expect(res.data.code).toEqual(Constants.errors.generalError.CODE);
        })
        .exhaustive();
};
